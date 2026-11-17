"use client";
import { useState } from "react";

export const WHATSAPP = "917060633107";
const SERVICES = ["Residential Construction", "Commercial Construction", "Interior Design & Decoration", "Architectural Planning & Design", "Renovation", "Modular Kitchen & Wardrobe", "Turnkey Solutions", "Other"];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = [
      "Hello IMPERIO, I'd like to discuss a project.",
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Service: ${f.get("service")}`,
      `Budget: ${f.get("budget")}`,
      `Preferred time: ${f.get("time")}`,
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="form">
      <label>Name<input name="name" required autoComplete="name" /></label>
      <label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label>
      <label>Service interested in
        <select name="service" required defaultValue="">
          <option value="" disabled>Choose a service</option>
          {SERVICES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Budget<input name="budget" placeholder="e.g. ₹50 lakh" /></label>
      <label>Preferred time to talk<input name="time" placeholder="e.g. Weekdays after 6 pm" /></label>
      <button type="submit" className="btn">Send on WhatsApp</button>
      {sent && <p className="note" role="status">WhatsApp opened with your details. Press send there to reach us.</p>}
    </form>
  );
}
