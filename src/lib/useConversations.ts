"use client";

import { useState, useEffect, useCallback } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type ConversationStore = Record<string, Message[]>;

const STORAGE_KEY = "companion-conversations";

function loadAll(): ConversationStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(store: ConversationStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable — silently degrade
  }
}

export function useConversations(characterId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const store = loadAll();
    setMessages(store[characterId] ?? []);
    setLoaded(true);
  }, [characterId]);

  // Persist whenever messages change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    const store = loadAll();
    store[characterId] = messages;
    saveAll(store);
  }, [messages, characterId, loaded]);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content } : m))
    );
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, setMessages, addMessage, updateMessage, clearHistory, loaded };
}

export function getLastMessagePreview(characterId: string): string | null {
  if (typeof window === "undefined") return null;
  const store = loadAll();
  const msgs = store[characterId];
  if (!msgs || msgs.length === 0) return null;
  const last = msgs[msgs.length - 1];
  const preview = last.content.slice(0, 50);
  return preview.length < last.content.length ? preview + "…" : preview;
}

export function getLastMessageTime(characterId: string): number | null {
  if (typeof window === "undefined") return null;
  const store = loadAll();
  const msgs = store[characterId];
  if (!msgs || msgs.length === 0) return null;
  return msgs[msgs.length - 1].timestamp;
}
