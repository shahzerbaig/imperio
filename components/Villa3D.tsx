
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Interactive gold wireframe villa.
 *
 * Controls:
 * - Drag: Rotate
 * - Pinch / Scroll: Zoom
 * - Two-finger drag / Right-click drag: Pan
 * - Release: Preserve orientation
 * - Auto showcase: Slowly rotate when idle
 * - Double click / Double tap: Reset view
 */

export default function Villa3D() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      1,
      0.1,
      100
    );

    camera.position.set(7, 4.5, 9);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      el.clientWidth,
      el.clientHeight
    );

    el.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;

    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.7;

    // Vertical rotation limits
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = Math.PI / 2;

    // Zoom limits
    controls.minDistance = 5;
    controls.maxDistance = 20;

    // Focus point
    controls.target.set(0, 1.5, 0);
    controls.update();

    // Materials
    const gold = new THREE.LineBasicMaterial({
      color: 0xc9a45c,
    });

    const dim = new THREE.LineBasicMaterial({
      color: 0xc9a45c,
      transparent: true,
      opacity: 0.35,
    });

    // Villa group
    const villa = new THREE.Group();

    const geometries: THREE.BufferGeometry[] = [];

    const block = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      material = gold
    ) => {
      const geometry = new THREE.EdgesGeometry(
        new THREE.BoxGeometry(w, h, d)
      );

      geometries.push(geometry);

      const lines = new THREE.LineSegments(
        geometry,
        material
      );

      lines.position.set(x, y, z);

      villa.add(lines);
    };

    // Ground floor
    block(4, 1.6, 2.6, 0, 0.8, 0);

    // Upper floor
    block(2.8, 1.4, 2.2, -0.5, 2.3, 0);

    // Tower
    block(2.2, 3.1, 1.6, 2.1, 1.55, -0.5);

    // Slabs
    block(4.4, 0.12, 3, 0, 1.66, 0, dim);
    block(3.2, 0.12, 2.6, -0.5, 3.06, 0, dim);
    block(2.6, 0.12, 2, 2.1, 3.16, -0.5, dim);

    // Front colonnade
    for (let i = 0; i < 5; i++) {
      block(
        0.12,
        1.6,
        0.12,
        -1.8 + i * 0.9,
        0.8,
        1.5,
        dim
      );
    }

    // Windows
    block(1.1, 0.7, 0.05, -1, 0.9, 1.31, dim);
    block(1.1, 0.7, 0.05, 0.6, 0.9, 1.31, dim);

    scene.add(villa);

    // Ground grid
    const grid = new THREE.GridHelper(
      24,
      24,
      0xc9a45c,
      0xc9a45c
    );

    const gridMaterial = grid.material as THREE.Material;

    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.12;

    scene.add(grid);

    // Ambient particles
    const points = new Float32Array(240 * 3);

    for (let i = 0; i < points.length; i++) {
      points[i] = (Math.random() - 0.5) * 16;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(points, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe8cf94,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    // Responsive resize
    const resize = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(el);

    // Reset camera
    const resetView = () => {
      camera.position.set(7, 4.5, 9);

      controls.target.set(0, 1.5, 0);

      controls.update();
    };

    // Double-click reset
    renderer.domElement.addEventListener(
      "dblclick",
      resetView
    );

    // Animation
    let raf = 0;
    let time = 0;

    const tick = () => {
      if (!reduceMotion) {
        time += 0.0035;

        // Gentle vertical floating
        villa.position.y = Math.sin(time * 6) * 0.08;
      }

      // Update interactive camera
      controls.update();

      renderer.render(scene, camera);

      raf = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);

      resizeObserver.disconnect();

      renderer.domElement.removeEventListener(
        "dblclick",
        resetView
      );

      controls.dispose();

      geometries.forEach((geometry) =>
        geometry.dispose()
      );

      particleGeometry.dispose();
      particleMaterial.dispose();

      gold.dispose();
      dim.dispose();

      renderer.dispose();

      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="villa"
      aria-label="Interactive 3D villa. Drag to rotate, pinch to zoom."
      role="img"
    />
  );
}
