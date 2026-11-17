"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import ContactForm, { WHATSAPP } from "@/components/ContactForm";

const Villa3D = dynamic(() => import("@/components/Villa3D"), { ssr: false });

const GROUPS = [
  { name: "Build", items: ["Residential Construction", "Commercial Construction", "Civil & Structural Work", "Turnkey Construction & Interior Solutions", "Site Supervision & Project Management"] },
  { name: "Design", items: ["Interior Design & Decoration", "Architectural Planning & Design", "Residential & Commercial Space Planning", "2D Floor Plan Designing", "Estimation & Cost Planning"] },
  { name: "Visualise", items: ["3D Elevation Designing", "3D Interior & Exterior Visualization"] },
  { name: "Finish", items: ["Home & Office Renovation", "Modular Kitchen & Wardrobe Design", "False Ceiling & Lighting Design", "Flooring & Wall Finishing", "Painting & Wall Paneling", "Custom Furniture Design"] },
];

const WHY = [
  ["Quality & excellence", "Premium materials, skilled workmanship and flawless execution."],
  ["Innovative designs", "Modern, creative and functional designs shaped around your vision."],
  ["Client satisfaction", "Your requirements, budget and satisfaction come first."],
  ["Complete solutions", "Planning, design, construction and final execution, managed end to end."],
];

export default function Home() {
  const [open, setOpen] = useState(0);
  return (
    <main>
      <header className="nav">
        <a href="#top" className="logo">IMPERIO</a>
        <nav>
          <a href="#services">Services</a>
          <a href="#why">Why Imperio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <Villa3D />
        <div className="hero-copy">
          <p className="est">Construction & Interiors · Est. 2026</p>
          <h1>We build dreams.<br />We create legacies.</h1>
          <p className="lead">Residential and commercial construction, interior design and turnkey delivery, planned and finished with uncompromising detail.</p>
          <div className="cta">
            <a className="btn" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            <a className="btn ghost" href="#services">Explore services</a>
          </div>
        </div>
      </section>

      <section id="services" className="sec">
        <h2>Our services</h2>
        <div className="acc">
          {GROUPS.map((g, i) => (
            <div key={g.name} className={`row ${open === i ? "on" : ""}`}>
              <button onClick={() => setOpen(i)} aria-expanded={open === i}>
                <span>{g.name}</span><i>{open === i ? "–" : "+"}</i>
              </button>
              {open === i && <ul>{g.items.map((s) => <li key={s}>{s}</li>)}</ul>}
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="sec alt">
        <h2>Why choose Imperio</h2>
        <div className="why">
          {WHY.map(([t, d]) => (<div key={t}><h3>{t}</h3><p>{d}</p></div>))}
        </div>
        <p className="trust">A transparent process: clear communication, project planning and cost transparency, with every project planned around your needs.</p>
      </section>

      <section id="contact" className="sec contact">
        <div>
          <h2>Start your project</h2>
          <p className="lead">Tell us what you have in mind. We reply on WhatsApp, any hour.</p>
          <dl>
            <dt>Phone</dt><dd><a href="tel:+917060633107">+91 70606 33107</a></dd>
            <dt>Email</dt><dd><a href="mailto:Hasanabuzar22@gmail.com">Hasanabuzar22@gmail.com</a></dd>
            <dt>Studio</dt><dd>Bijnor, India</dd>
            <dt>Hours</dt><dd>Open 24 hours</dd>
            <dt>Instagram</dt><dd><a href="https://www.instagram.com/imperioconstruction0001" target="_blank" rel="noopener noreferrer">@imperioconstruction0001</a></dd>
          </dl>
        </div>
        <ContactForm />
      </section>

      <iframe className="map" title="Imperio location, Bijnor" loading="lazy" src="https://www.google.com/maps?q=Bijnor,India&output=embed" />
      <footer>© 2026 IMPERIO Construction & Interiors. We Build Dreams, We Create Legacies.</footer>
    </main>
  );
}
