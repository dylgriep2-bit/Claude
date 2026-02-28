"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { companions, welcomeMessages } from "@/lib/companions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const params = useParams();
  const companionId = params.id as string;
  const companion = companions.find((c) => c.id === companionId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingIdRef = useRef<string | null>(null);

  // Set welcome message on mount
  useEffect(() => {
    if (companion) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessages[companion.id] ?? "hey, what's up?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [companion]);

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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const assistantId = `assistant-${Date.now() + 1}`;
    streamingIdRef.current = assistantId;

    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
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
          companionId,
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

  if (!companion) {
    return (
      <div className="not-found">
        <h1>Companion not found</h1>
        <Link href="/companions" className="back-to-companions">
          Browse companions
        </Link>
      </div>
    );
  }

  const isTyping = isStreaming;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <Link href="/companions" className="header-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="avatar" style={{ background: companion.gradient }}>
          {companion.avatar}
        </div>
        <div className="header-info">
          <h1 className="character-name">{companion.name}</h1>
          <span className="status">
            <span className={`status-dot ${isTyping ? "typing" : ""}`} />
            {isTyping ? "typing..." : "online"}
          </span>
        </div>
      </header>

      {/* Messages */}
      <main className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.role === "user" ? "user" : "companion"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="avatar-small"
                style={{ background: companion.gradient }}
              >
                {companion.avatar}
              </div>
            )}
            <div className="bubble-wrapper">
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
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="input-area">
        <form className="input-form" onSubmit={sendMessage}>
          <textarea
            ref={textareaRef}
            className="input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${companion.name}...`}
            rows={1}
            disabled={isStreaming}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isStreaming}
            aria-label="Send"
          >
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
