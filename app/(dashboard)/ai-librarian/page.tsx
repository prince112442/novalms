"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconChat, IconSend } from "@/components/ui/icons";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AiLibrarianPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm the AI Librarian. Ask me things like \"find books about databases\" or \"recommend something like Clean Code.\"" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-librarian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I couldn't reach the AI Librarian right now." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-5 flex items-center gap-2.5">
        <IconChat className="h-6 w-6 text-orange" />
        <div>
          <h1 className="text-2xl font-bold">AI Librarian</h1>
          <p className="text-[13.5px] text-slate-500">Ask about the catalog in plain language.</p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13.5px] ${
                  m.role === "user" ? "bg-navy-900 text-white" : "bg-[var(--bg)] text-navy-900"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-[13px] text-slate-500">AI Librarian is thinking...</div>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="mt-3.5 flex gap-2 border-t border-slate-200 pt-3.5">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <IconSend className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
