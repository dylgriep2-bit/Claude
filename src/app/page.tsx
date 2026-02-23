"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "hey — what's up?",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingIdRef = useRef<string | null>(null);

  // Auto-scroll on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const assistantId = `maya-${Date.now() + 1}`;
    streamingIdRef.current = assistantId;

    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        const id = streamingIdRef.current;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content: accumulated } : m))
        );
      }
    } catch (err) {
      console.error("Stream error:", err);
      // Replace the empty assistant bubble with an error notice
      const id = streamingIdRef.current;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, content: "something went wrong, try again?" }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      streamingIdRef.current = null;
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isTyping = isStreaming;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="avatar">M</div>
        <div className="header-info">
          <h1 className="character-name">Maya</h1>
          <span className="status">
            <span className={`status-dot ${isTyping ? "typing" : ""}`} />
            {isTyping ? "typing…" : "online"}
          </span>
        </div>
      </header>

      {/* ── Messages ── */}
      <main className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.role === "user" ? "user" : "maya"}`}
          >
            {msg.role === "assistant" && (
              <div className="avatar-small">M</div>
            )}
            <div className="bubble">
              {msg.content === "" ? (
                <span className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* ── Input ── */}
      <div className="input-area">
        <form className="input-form" onSubmit={sendMessage}>
          <textarea
            ref={textareaRef}
            className="input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message Maya…"
            rows={1}
            disabled={isStreaming}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isStreaming}
            aria-label="Send"
          >
            {/* Paper-plane icon */}
            <svg
              className="send-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
