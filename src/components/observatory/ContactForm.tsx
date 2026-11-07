"use client";
import { useState, useRef, type FormEvent } from "react";
import Arrow from "./Arrow";
export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const form = useRef<HTMLFormElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!response.ok) throw new Error("Unable to send");
      setStatus("success");
      form.current?.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <form className="contact-form liquid-glass" onSubmit={submit} ref={form}>
      <div className="form-row">
        <label>
          Your name
          <input
            autoComplete="name"
            name="name"
            placeholder="Alex Morgan"
            required
            maxLength={100}
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="alex@example.com"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        What do you have in mind?
        <textarea
          name="message"
          placeholder="A project, an idea, or just a hello…"
          rows={3}
          required
          maxLength={5000}
        />
      </label>
      <div className="form-action">
        <span className="form-status" role="status" aria-live="polite">
          {status === "success"
            ? "Message received. Thank you for reaching out."
            : status === "error"
              ? "Couldn’t send this time. Please try again or email me directly."
              : "Good things start with a conversation."}
        </span>
        <button className="light-button" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          <Arrow diagonal />
        </button>
      </div>
    </form>
  );
}
