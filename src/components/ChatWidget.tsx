"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Anchor, X, Send, GripVertical } from "lucide-react";

type Message = { role: "user" | "assistant" | "typing"; content: string };

const QUICK_QUESTIONS = [
  "Pre-Sea Deck course fees?",
  "How do I apply?",
  "What STCW courses do you offer?",
  "BST course details?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hello! 👋 I'm the SeaLearn Nigeria assistant. I can help you with STCW courses, fees (₦ Naira), admissions, and how to use the student portal.\n\nWhat would you like to know?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Draggable position — null means use default CSS (bottom-6 right-6)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    // Anchor offset to the toggle button (bottom of container)
    dragOffset.current = { x: clientX - rect.right, y: clientY - rect.bottom };
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const newRight = window.innerWidth - (clientX - dragOffset.current.x);
      const newBottom = window.innerHeight - (clientY - dragOffset.current.y);
      setPos({
        x: Math.max(8, Math.min(newRight, window.innerWidth - 64)),
        y: Math.max(8, Math.min(newBottom, window.innerHeight - 64)),
      });
    }
    function onUp() { dragging.current = false; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setShowQuick(false);
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const typingMsg: Message = { role: "typing", content: "SeaLearn Assistant is typing…" };
    setMessages((prev) => [...prev, typingMsg]);

    // Build history for API (exclude welcome + typing)
    const history = [...messages, userMsg]
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      // Replace typing indicator with streaming message
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

        for (const line of lines) {
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.delta?.text ?? parsed?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              reply += delta;
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", content: reply },
              ]);
            }
          } catch {
            // Non-JSON SSE line, skip
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "assistant",
          content:
            "I'm temporarily offline. Please contact us at +234 701 234 5678 or info@sealearn.edu.ng.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-50 flex flex-col items-end gap-3"
      style={pos ? { bottom: pos.y, right: pos.x } : { bottom: 24, right: 24 }}
    >
      {/* Panel */}
      {open && (
        <div className="w-80 sm:w-[340px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-ocean px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center shrink-0">
              <Anchor size={16} className="text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-bold">SeaLearn Assistant</div>
              <div className="text-white/60 text-[11px]">Powered by Claude AI · Online</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 max-h-80 overflow-y-auto p-3 flex flex-col gap-2 bg-surface">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-ocean text-white self-end rounded-br-sm"
                    : m.role === "typing"
                    ? "bg-white text-muted self-start italic text-xs shadow-sm"
                    : "bg-white text-body self-start rounded-bl-sm shadow-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {showQuick && (
            <div className="px-3 py-2 flex flex-wrap gap-1.5 bg-white border-t border-border">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] text-ocean border border-border bg-surface rounded-full px-2.5 py-1 hover:bg-ocean hover:text-white hover:border-ocean transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-border">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about courses, fees, admissions…"
              disabled={loading}
              className="flex-1 text-sm border border-border rounded-full px-4 py-2 outline-none focus:border-ocean disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full bg-ocean flex items-center justify-center text-white hover:bg-navy transition-colors disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
          <div className="text-center py-1.5 bg-white text-[10px] text-muted border-t border-border">
            Powered by <span className="text-ocean font-bold">Claude AI</span> · SeaLearn Nigeria
          </div>
        </div>
      )}

      {/* Toggle button with drag handle */}
      <div className="flex items-center gap-1.5">
        <div
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          className="w-6 h-14 flex items-center justify-center text-white/40 hover:text-white/80 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to move"
        >
          <GripVertical size={16} />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-navy to-ocean shadow-xl flex items-center justify-center text-gold hover:scale-105 transition-transform"
          title="SeaLearn Assistant"
        >
          {open ? <X size={22} /> : <Anchor size={22} />}
        </button>
      </div>
    </div>
  );
}
