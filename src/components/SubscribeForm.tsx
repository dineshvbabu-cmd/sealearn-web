"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! We'll keep you updated.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
        disabled={status === "loading" || status === "success"}
        className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/30 outline-none focus:border-gold mb-2"
      />
      {status === "success" || status === "error" ? (
        <p className={`text-xs mb-2 ${status === "success" ? "text-jade" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full bg-gold text-navy font-bold text-sm py-2.5 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : status === "success" ? "Subscribed ✓" : "Subscribe"}
      </button>
    </form>
  );
}
