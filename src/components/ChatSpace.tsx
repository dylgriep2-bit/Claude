"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Space } from "@/lib/spaces";
import { UserProgress, ConversationMessage, addMessage, saveProgress } from "@/lib/progression";
import SpaceBackground from "./SpaceBackground";
import Message from "./Message";
import TypingDots from "./TypingDots";

interface Props {
  space: Space;
  progress: UserProgress;
  onProgressUpdate: (p: UserProgress) => void;
  onBack: () => void;
}

const MOODS = [
  { emoji: "😌", label: "calm" },
  { emoji: "😢", label: "sad" },
  { emoji: "😤", label: "angry" },
  { emoji: "🥰", label: "loving" },
  { emoji: "😏", label: "flirty" },
  { emoji: "🫠", label: "lost" },
  { emoji: "✨", label: "hopeful" },
  { emoji: "😴", label: "tired" },
];

export default function ChatSpace({ space, progress, onProgressUpdate, onBack }: Props) {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showMoods, setShowMoods] = useState(false);
  const [showSongInput, setShowSongInput] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progressRef = useRef(progress);

  const messages = progress.conversations[space.id] || [];
  const [r, g, b] = space.accent;

  // Keep ref in sync
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Hide welcome after first message
  useEffect(() => {
    if (messages.length > 0) setShowWelcome(false);
  }, [messages.length]);

  // Preload voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const speakText = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Google UK English Female")
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const song = songTitle.trim() && songArtist.trim()
      ? { title: songTitle.trim(), artist: songArtist.trim() }
      : undefined;

    const userMsg: ConversationMessage = {
      role: "user",
      content: text,
      mood: selectedMood || undefined,
      song,
      timestamp: Date.now(),
    };

    // Update progress with user message
    let updated = addMessage(progressRef.current, space.id, userMsg);
    onProgressUpdate(updated);
    saveProgress(updated);

    setInput("");
    setSelectedMood(null);
    setSongTitle("");
    setSongArtist("");
    setShowSongInput(false);
    setShowMoods(false);
    setIsStreaming(true);

    try {
      // Build messages for API
      const apiMessages = (updated.conversations[space.id] || []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          space: space.id,
          userName: updated.userName,
        }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Update the assistant message in progress as it streams
        const tempMsg: ConversationMessage = {
          role: "assistant",
          content: fullText,
          timestamp: Date.now(),
        };
        const tempConvos = { ...updated.conversations };
        const spaceConvo = [...(tempConvos[space.id] || [])];
        // Remove any previous temp assistant message
        if (spaceConvo.length > 0 && spaceConvo[spaceConvo.length - 1].role === "assistant" && spaceConvo[spaceConvo.length - 1].timestamp === 0) {
          spaceConvo.pop();
        }
        spaceConvo.push({ ...tempMsg, timestamp: 0 }); // temp marker
        tempConvos[space.id] = spaceConvo;
        onProgressUpdate({ ...updated, conversations: tempConvos });
      }

      // Finalize the assistant message
      const assistantMsg: ConversationMessage = {
        role: "assistant",
        content: fullText,
        timestamp: Date.now(),
      };

      // Remove temp message, add final
      const finalConvos = { ...updated.conversations };
      const finalSpaceConvo = [...(finalConvos[space.id] || [])];
      if (finalSpaceConvo.length > 0 && finalSpaceConvo[finalSpaceConvo.length - 1].timestamp === 0) {
        finalSpaceConvo.pop();
      }
      finalConvos[space.id] = finalSpaceConvo;
      updated = { ...updated, conversations: finalConvos };

      updated = addMessage(updated, space.id, assistantMsg);
      onProgressUpdate(updated);
      saveProgress(updated);

      if (autoSpeak && fullText) {
        speakText(fullText);
      }
    } catch {
      const errMsg: ConversationMessage = {
        role: "assistant",
        content: "...i lost my train of thought. say that again?",
        timestamp: Date.now(),
      };
      updated = addMessage(updated, space.id, errMsg);
      onProgressUpdate(updated);
      saveProgress(updated);
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  }, [input, isStreaming, selectedMood, songTitle, songArtist, space, onProgressUpdate, autoSpeak, speakText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-space">
      <SpaceBackground spaceId={space.id} accent={space.accent} />

      {/* Header */}
      <header className="chat-header" style={{ borderColor: `rgba(${r}, ${g}, ${b}, 0.1)` }}>
        <button className="back-btn" onClick={onBack} aria-label="Back to home">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="header-info">
          <h1 className="header-space-name" style={{ color: `rgba(${r}, ${g}, ${b}, 0.8)` }}>
            {space.name}
          </h1>
          <span className="header-tagline">{space.tagline}</span>
        </div>
        <div className="header-actions">
          <button
            className={`voice-toggle ${voiceEnabled ? "voice-on" : ""}`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={voiceEnabled ? { color: `rgba(${r}, ${g}, ${b}, 0.8)` } : {}}
            aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
          >
            {voiceEnabled ? "🔊" : "🔇"}
          </button>
          {voiceEnabled && (
            <button
              className={`auto-speak-toggle ${autoSpeak ? "auto-on" : ""}`}
              onClick={() => setAutoSpeak(!autoSpeak)}
              style={autoSpeak ? { color: `rgba(${r}, ${g}, ${b}, 0.8)` } : {}}
              aria-label={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
              title="Auto-speak responses"
            >
              A
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages" ref={messagesRef}>
        {showWelcome && messages.length === 0 && (
          <div className="welcome-message">
            <p style={{ color: `rgba(${r}, ${g}, ${b}, 0.6)` }}>
              {space.welcomeMessage}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <Message key={i} message={msg} accent={space.accent} voiceEnabled={voiceEnabled} />
        ))}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="message-row message-companion">
            <div className="message-bubble bubble-companion">
              <TypingDots accent={space.accent} />
            </div>
          </div>
        )}
      </div>

      {/* Mood selector */}
      {showMoods && (
        <div className="mood-bar" style={{ borderColor: `rgba(${r}, ${g}, ${b}, 0.1)` }}>
          {MOODS.map((m) => (
            <button
              key={m.label}
              className={`mood-btn ${selectedMood === m.label ? "mood-selected" : ""}`}
              onClick={() => {
                setSelectedMood(selectedMood === m.label ? null : m.label);
              }}
              style={selectedMood === m.label ? { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)` } : {}}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      )}

      {/* Song input */}
      {showSongInput && (
        <div className="song-bar" style={{ borderColor: `rgba(${r}, ${g}, ${b}, 0.1)` }}>
          <input
            type="text"
            placeholder="song title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="song-input"
          />
          <span className="song-dash">—</span>
          <input
            type="text"
            placeholder="artist"
            value={songArtist}
            onChange={(e) => setSongArtist(e.target.value)}
            className="song-input"
          />
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area" style={{ borderColor: `rgba(${r}, ${g}, ${b}, 0.08)` }}>
        <div className="input-actions">
          <button
            className={`action-btn ${showMoods ? "action-active" : ""}`}
            onClick={() => { setShowMoods(!showMoods); setShowSongInput(false); }}
            style={showMoods ? { color: `rgba(${r}, ${g}, ${b}, 0.7)` } : {}}
            title="Set mood"
          >
            ◐
          </button>
          <button
            className={`action-btn ${showSongInput ? "action-active" : ""}`}
            onClick={() => { setShowSongInput(!showSongInput); setShowMoods(false); }}
            style={showSongInput ? { color: `rgba(${r}, ${g}, ${b}, 0.7)` } : {}}
            title="Share a song"
          >
            ♪
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="say something..."
          className="chat-textarea"
          rows={1}
          disabled={isStreaming}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={isStreaming || !input.trim()}
          style={
            input.trim() && !isStreaming
              ? { color: `rgba(${r}, ${g}, ${b}, 0.8)` }
              : {}
          }
          aria-label="Send"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L16 4L12 16L10 11L4 10Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Selected mood indicator */}
      {selectedMood && (
        <div className="selected-mood-indicator" style={{ color: `rgba(${r}, ${g}, ${b}, 0.5)` }}>
          feeling: {selectedMood}
        </div>
      )}
    </div>
  );
}
