"use client";

import { useState, useCallback } from "react";
import { ConversationMessage } from "@/lib/progression";

interface Props {
  message: ConversationMessage;
  accent: [number, number, number];
  voiceEnabled: boolean;
}

export default function Message({ message, accent, voiceEnabled }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [r, g, b] = accent;
  const isUser = message.role === "user";

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Google UK English Female")
    );
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [message.content, speaking]);

  return (
    <div className={`message-row ${isUser ? "message-user" : "message-companion"}`}>
      <div
        className={`message-bubble ${isUser ? "bubble-user" : "bubble-companion"}`}
        style={
          isUser
            ? { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`, borderColor: `rgba(${r}, ${g}, ${b}, 0.1)` }
            : {}
        }
      >
        <p>{message.content}</p>
        {message.song && (
          <div className="song-tag" style={{ borderColor: `rgba(${r}, ${g}, ${b}, 0.2)` }}>
            <span className="song-icon">♪</span>
            <span>
              {message.song.title} — {message.song.artist}
            </span>
          </div>
        )}
        {message.mood && (
          <div className="mood-tag">{message.mood}</div>
        )}
        {!isUser && voiceEnabled && (
          <button
            className="speak-btn"
            onClick={speak}
            style={{ color: `rgba(${r}, ${g}, ${b}, ${speaking ? 0.8 : 0.4})` }}
            aria-label={speaking ? "Stop speaking" : "Speak message"}
          >
            {speaking ? "■" : "▶"}
          </button>
        )}
      </div>
    </div>
  );
}
