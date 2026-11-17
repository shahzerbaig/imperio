
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Villa3D() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---------------------------------
    // SCENE & CAMERA
    // ---------------------------------

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      1,
      0.1,
      100
    );

    camera.position.set(8, 5.5, 11);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    el.appendChild(renderer.domElement);

    // ---------------------------------
    // ORBIT CONTROLS
    // ---------------------------------

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

    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI / 2.02;

    controls.minDistance = 4;
    controls.maxDistance = 25;

    controls.target.set(0, 1.3, 1);
    controls.update();

    // ---------------------------------
    // MATERIALS
    // ---------------------------------

    const gold = new THREE.LineBasicMaterial({
      color: 0xc9a45c,
    });

    const dim = new THREE.LineBasicMaterial({
      color: 0xc9a45c,
      transparent: true,
      opacity: 0.35,
    });

    const bright = new THREE.LineBasicMaterial({
      color: 0xf4d48a,
    });

    const green = new THREE.LineBasicMaterial({
      color: 0x719b70,
      transparent: true,
      opacity: 0.75,
    });

    const gardenDim = new THREE.LineBasicMaterial({
      color: 0x719b70,
      transparent: true,
      opacity: 0.3,
    });

    const materials = [
      gold,
      dim,
      bright,
      green,
      gardenDim,
    ];

    const geometries: THREE.BufferGeometry[] = [];

    const property = new THREE.Group();
    scene.add(property);

    // ---------------------------------
    // GEOMETRY HELPERS
    // ---------------------------------

    const block = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      material: THREE.LineBasicMaterial = gold,
      parent: THREE.Object3D = property
    ) => {
      const boxGeometry = new THREE.BoxGeometry(
        w,
        h,
        d
      );

      const geometry = new THREE.EdgesGeometry(
        boxGeometry
      );

      boxGeometry.dispose();
      geometries.push(geometry);

      const lines = new THREE.LineSegments(
        geometry,
        material
      );

      lines.position.set(x, y, z);
      parent.add(lines);

      return lines;
    };

    const line = (
      points: THREE.Vector3[],
      material: THREE.LineBasicMaterial = dim
    ) => {
      const geometry = new THREE.BufferGeometry()
        .setFromPoints(points);

      geometries.push(geometry);

      const object = new THREE.Line(
        geometry,
        material
      );

      property.add(object);

      return object;
    };

    const circle = (
      radius: number,
      x: number,
      y: number,
      z: number,
      material: THREE.LineBasicMaterial = green,
      segments = 32
    ) => {
      const points: THREE.Vector3[] = [];

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        points.push(
          new THREE.Vector3(
            x + Math.cos(angle) * radius,
            y,
            z + Math.sin(angle) * radius
          )
        );
      }

      return line(points, material);
    };

    // ---------------------------------
    // MAIN VILLA
    // ---------------------------------

    // Ground floor
    block(4, 1.6, 2.6, 0, 0.8, 0);

    // Upper floor
    block(2.8, 1.4, 2.2, -0.5, 2.3, 0);

    // Architectural tower
    block(2.2, 3.1, 1.6, 2.1, 1.55, -0.5);

    // Floor slabs
    block(4.4, 0.12, 3, 0, 1.66, 0, dim);

    block(
      3.2, 0.12, 2.6,
      -0.5, 3.06, 0,
      dim
    );

    block(
      2.6, 0.12, 2,
      2.1, 3.16, -0.5,
      dim
    );

    // ---------------------------------
    // FRONT COLUMNS
    // ---------------------------------

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

    // ---------------------------------
    // GROUND FLOOR WINDOWS
    // ---------------------------------

    const addWindow = (
      x: number,
      y: number,
      z: number,
      width: number,
      height: number
    ) => {
      // Outer frame
      block(
        width,
        height,
        0.06,
        x,
        y,
        z,
        bright
      );

      // Vertical mullion
      block(
        0.025,
        height,
        0.07,
        x,
        y,
        z,
        dim
      );

      // Horizontal mullion
      block(
        width,
        0.025,
        0.07,
        x,
        y,
        z,
        dim
      );

      // Window sill
      block(
        width + 0.12,
        0.05,
        0.18,
        x,
        y - height / 2 - 0.04,
        z + 0.05,
        gold
      );
    };

    addWindow(
      -1.15,
      0.95,
      1.34,
      0.85,
      0.65
    );

    addWindow(
      1.1,
      0.95,
      1.34,
      0.65,
      0.65
    );

    // ---------------------------------
    // MAIN ENTRANCE DOOR
    // ---------------------------------

    const doorX = -0.1;
    const doorZ = 1.36;

    // Main door frame
    block(
      0.72,
      1.35,
      0.08,
      doorX,
      0.675,
      doorZ,
      bright
    );

    // Inner door panel
    block(
      0.62,
      1.25,
      0.025,
      doorX,
      0.675,
      doorZ + 0.045,
      dim
    );

    // Decorative door panels
    block(
      0.44,
      0.48,
      0.025,
      doorX,
      0.98,
      doorZ + 0.065,
      dim
    );

    block(
      0.44,
      0.48,
      0.025,
      doorX,
      0.42,
      doorZ + 0.065,
      dim
    );

    // Door handle
    block(
      0.035,
      0.15,
      0.035,
      doorX + 0.23,
      0.7,
      doorZ + 0.1,
      bright
    );

    // Entrance step
    block(
      1.1,
      0.12,
      0.55,
      doorX,
      0.06,
      1.7,
      gold
    );

    // Entrance canopy
    block(
      1.25,
      0.08,
      0.7,
      doorX,
      1.5,
      1.55,
      gold
    );

    // ---------------------------------
    // FIRST FLOOR WINDOW
    // ---------------------------------

    // Upper-floor front face is z = 1.1
    addWindow(
      -0.7,
      2.35,
      1.135,
      1.25,
      0.85
    );

    // Decorative top lintel
    block(
      1.45,
      0.07,
      0.18,
      -0.7,
      2.82,
      1.2,
      gold
    );

    // ---------------------------------
    // PROPERTY GROUND / GARDEN
    // ---------------------------------

    // Plot boundary
    block(
      9,
      0.04,
      10,
      0,
      -0.04,
      2,
      dim
    );

    // Front garden begins beyond house
    // House front: z = 1.3

    // Left lawn bed
    block(
      2.5,
      0.025,
      3.6,
      -2.8,
      0.015,
      4.2,
      green
    );

    // Right lawn bed
    block(
      2.5,
      0.025,
      3.6,
      2.8,
      0.015,
      4.2,
      green
    );

    // Garden border edging
    block(
      2.65,
      0.12,
      3.75,
      -2.8,
      0.06,
      4.2,
      gardenDim
    );

    block(
      2.65,
      0.12,
      3.75,
      2.8,
      0.06,
      4.2,
      gardenDim
    );

    // ---------------------------------
    // WALKWAY TO ENTRANCE
    // ---------------------------------

    // Path from front gate to door
    block(
      1.1,
      0.035,
      4.8,
      doorX,
      0.025,
      4.1,
      gold
    );

    // Individual paving divisions
    for (let i = 0; i < 9; i++) {
      const z = 1.9 + i * 0.5;

      line(
        [
          new THREE.Vector3(
            doorX - 0.55, 0.05, z
          ),
          new THREE.Vector3(
            doorX + 0.55, 0.05, z
          ),
        ],
        dim
      );
    }

    // ---------------------------------
    // GARDEN TREES
    // ---------------------------------

    const addTree = (
      x: number,
      z: number,
      height = 1.4
    ) => {
      // Trunk
      block(
        0.12,
        height * 0.55,
        0.12,
        x,
        height * 0.275,
        z,
        gold
      );

      // Wireframe foliage
      const foliageGeometry = new THREE.IcosahedronGeometry(
        height * 0.42,
        1
      );

      const edges = new THREE.EdgesGeometry(
        foliageGeometry
      );

      foliageGeometry.dispose();
      geometries.push(edges);

      const crown = new THREE.LineSegments(
        edges,
        green
      );

      crown.position.set(
        x,
        height * 0.82,
        z
      );

      property.add(crown);

      // Ground planting ring
      circle(
        0.5,
        x,
        0.035,
        z,
        gardenDim
      );
    };

    addTree(-3.2, 3.2, 1.5);
    addTree(-3.2, 5.2, 1.2);
    addTree(3.2, 3.2, 1.5);
    addTree(3.2, 5.2, 1.2);

    // ---------------------------------
    // SHRUBS AND FLOWER BEDS
    // ---------------------------------

    const addShrub = (
      x: number,
      z: number,
      radius = 0.22
    ) => {
      const geometry = new THREE.IcosahedronGeometry(
        radius,
        1
      );

      const edges = new THREE.EdgesGeometry(
        geometry
      );

      geometry.dispose();
      geometries.push(edges);

      const shrub = new THREE.LineSegments(
        edges,
        green
      );

      shrub.position.set(
        x,
        radius,
        z
      );

      property.add(shrub);
    };

    // Shrub rows on both sides of walkway
    for (let i = 0; i < 8; i++) {
      const z = 2.15 + i * 0.55;

      addShrub(-0.85, z, 0.18);
      addShrub(0.85, z, 0.18);
    }

    // Garden flower bed patterns
    for (let i = 0; i < 5; i++) {
      circle(
        0.18,
        -2.1 + (i % 2) * 0.55,
        0.04,
        3.1 + i * 0.55,
        gardenDim
      );

      circle(
        0.18,
        2.1 + (i % 2) * 0.55,
        0.04,
        3.1 + i * 0.55,
        gardenDim
      );
    }

    // ---------------------------------
    // GARDEN BOUNDARY FENCE
    // ---------------------------------

    // Left boundary
    block(
      0.06,
      0.65,
      9.5,
      -4.45,
      0.325,
      2,
      dim
    );

    // Right boundary
    block(
      0.06,
      0.65,
      9.5,
      4.45,
      0.325,
      2,
      dim
    );

    // Rear boundary
    block(
      8.9,
      0.65,
      0.06,
      0,
      0.325,
      -2.75,
      dim
    );

    // Front boundary with gate opening
    block(
      3.5,
      0.65,
      0.06,
      -2.75,
      0.325,
      6.75,
      dim
    );

    block(
      3.5,
      0.65,
      0.06,
      2.75,
      0.325,
      6.75,
      dim
    );

    // Gate posts
    block(
      0.15,
      0.9,
      0.15,
      -0.9,
      0.45,
      6.75,
      bright
    );

    block(
      0.15,
      0.9,
      0.15,
      0.9,
      0.45,
      6.75,
      bright
    );

    // ---------------------------------
    // GROUND GRID
    // ---------------------------------

    const grid = new THREE.GridHelper(
      30,
      30,
      0xc9a45c,
      0xc9a45c
    );

    const gridMaterial = grid.material as THREE.Material;

    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.09;

    grid.position.y = -0.09;
    scene.add(grid);

    // ---------------------------------
    // AMBIENT PARTICLES
    // ---------------------------------

    const points = new Float32Array(240 * 3);

    for (let i = 0; i < points.length; i++) {
      points[i] = (Math.random() - 0.5) * 18;
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
      opacity: 0.6,
    });

    scene.add(
      new THREE.Points(
        particleGeometry,
        particleMaterial
      )
    );

    // ---------------------------------
    // RESPONSIVE RESIZE
    // ---------------------------------

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
    resize();

    // ---------------------------------
    // RESET VIEW
    // ---------------------------------

    const resetView = () => {
      camera.position.set(8, 5.5, 11);
      controls.target.set(0, 1.3, 1);
      controls.update();
    };

    renderer.domElement.addEventListener(
      "dblclick",
      resetView
    );

    // ---------------------------------
    // ANIMATION
    // ---------------------------------

    let raf = 0;
    let lastInteraction = performance.now();

    const onInteraction = () => {
      lastInteraction = performance.now();
    };

    controls.addEventListener(
      "start",
      onInteraction
    );

    const tick = () => {
      // Auto-showcase after 6 seconds of inactivity
      if (
        !reduceMotion &&
        performance.now() - lastInteraction > 6000
      ) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
      } else {
        controls.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);

      raf = requestAnimationFrame(tick);
    };

    tick();

    // ---------------------------------
    // CLEANUP
    // ---------------------------------

    return () => {
      cancelAnimationFrame(raf);

      resizeObserver.disconnect();

      renderer.domElement.removeEventListener(
        "dblclick",
        resetView
      );

      controls.removeEventListener(
        "start",
        onInteraction
      );

      controls.dispose();

      geometries.forEach((geometry) =>
        geometry.dispose()
      );

      materials.forEach((material) =>
        material.dispose()
      );

      particleGeometry.dispose();
      particleMaterial.dispose();

      grid.geometry.dispose();
      gridMaterial.dispose();

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="villa"
      role="img"
      aria-label="Interactive 3D villa with landscaped garden, main entrance and first-floor window. Drag to rotate and pinch to zoom."
    />
  );
}
