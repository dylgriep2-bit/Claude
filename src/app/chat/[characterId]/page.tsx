"use client";

import { useState, useRef, useEffect, FormEvent, use } from "react";
import { getCharacter } from "@/lib/characters";
import { useConversations, Message } from "@/lib/useConversations";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChatPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = use(params);
  const character = getCharacter(characterId);
  const router = useRouter();
  const { messages, addMessage, updateMessage, loaded } =
    useConversations(characterId);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingIdRef = useRef<string | null>(null);

  // Add welcome message if conversation is empty
  useEffect(() => {
    if (loaded && messages.length === 0 && character) {
      addMessage({
        id: "welcome",
        role: "assistant",
        content: character.messagePreview,
        timestamp: Date.now(),
      });
    }
  }, [loaded, messages.length, character, addMessage]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!character) {
    return (
      <div className="app">
        <div className="empty-state">
          <p>Companion not found</p>
          <Link href="/" className="back-link">
            Go back
          </Link>
        </div>
      </div>
    );
  }

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

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const assistantId = `${characterId}-${Date.now() + 1}`;
    streamingIdRef.current = assistantId;

    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    addMessage(userMsg);
    addMessage(assistantMsg);
    setInput("");
    setIsStreaming(true);

    // Build history including new user message
    const history = [...messages, userMsg].map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, characterId }),
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
        if (id) updateMessage(id, accumulated);
      }
    } catch (err) {
      console.error("Stream error:", err);
      const id = streamingIdRef.current;
      if (id) updateMessage(id, "something went wrong, try again?");
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
      {/* Header */}
      <header className="header">
        <button
          className="back-button"
          onClick={() => router.push("/")}
          aria-label="Back"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <Link href={`/profile/${character.id}`} className="header-profile-link">
          <div
            className="avatar"
            style={{ background: character.gradient }}
          >
            {character.avatar}
          </div>
          <div className="header-info">
            <h1 className="character-name">{character.name}</h1>
            <span className="status">
              <span className={`status-dot ${isTyping ? "typing" : character.status}`} />
              {isTyping ? "typing…" : character.status}
            </span>
          </div>
        </Link>
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
                style={{ background: character.gradient }}
              >
                {character.avatar}
              </div>
            )}
            <div
              className="bubble"
              style={
                msg.role === "user"
                  ? { background: character.accentColor }
                  : undefined
              }
            >
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

      {/* Input */}
      <div className="input-area">
        <form className="input-form" onSubmit={sendMessage}>
          <textarea
            ref={textareaRef}
            className="input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${character.name}…`}
            rows={1}
            disabled={isStreaming}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isStreaming}
            style={{ background: character.accentColor }}
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
