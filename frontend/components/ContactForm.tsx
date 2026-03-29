"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    name:     "",
    email:    "",
    phone:    "",
    city:     "",
    message:  "",
    interest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-white border border-[rgba(201,169,110,0.2)] p-10 lg:p-14 text-center">
        <div className="w-12 h-12 border border-[#C9A96E] flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#C9A96E" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-[1.6rem] font-light text-[#3D2B1F] mb-3">
          Message Received
        </h3>
        <p className="font-sans text-sm text-[#8B7D6E] font-light">
          Thank you for reaching out. Our team will get back to you within 4–6 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 lg:p-10 border border-[rgba(61,43,31,0.06)] space-y-5"
    >
      <p className="eyebrow mb-1">Send a Message</p>
      <h3 className="font-serif text-[1.5rem] font-light text-[#3D2B1F] mb-6">
        Tell us about your project
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#8B7D6E] block mb-1.5">
            Full Name *
          </label>
          <input
            id="name" name="name" type="text" required
            value={formData.name} onChange={handleChange}
            placeholder="Your name"
            className="luxury-input"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#8B7D6E] block mb-1.5">
            Email *
          </label>
          <input
            id="email" name="email" type="email" required
            value={formData.email} onChange={handleChange}
            placeholder="you@email.com"
            className="luxury-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#8B7D6E] block mb-1.5">
            Phone
          </label>
          <input
            id="phone" name="phone" type="tel"
            value={formData.phone} onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            className="luxury-input"
          />
        </div>
        <div>
          <label htmlFor="city" className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#8B7D6E] block mb-1.5">
            City
          </label>
          <input
            id="city" name="city" type="text"
            value={formData.city} onChange={handleChange}
            placeholder="Mumbai, Delhi..."
            className="luxury-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#8B7D6E] block mb-1.5">
          Interested In
        </label>
        <select
          id="interest" name="interest"
          value={formData.interest} onChange={handleChange}
          className="luxury-input"
        >
          <option value="">Select a category</option>
          <option value="sofas">Sofas</option>
          <option value="chairs">Chairs</option>
          <option value="coffee-tables">Coffee Tables</option>
          <option value="dining">Dining</option>
          <option value="custom">Custom Order</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#8B7D6E] block mb-1.5">
          Message *
        </label>
        <textarea
          id="message" name="message" required rows={5}
          value={formData.message} onChange={handleChange}
          placeholder="Tell us about your space, requirements, or any specific product you're interested in..."
          className="luxury-input resize-none"
        />
      </div>

      {status === "error" && (
        <p className="font-sans text-xs text-red-600">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full justify-center"
      >
        <span>{status === "sending" ? "Sending..." : "Send Message"}</span>
        {status !== "sending" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
    </form>
  );
}
