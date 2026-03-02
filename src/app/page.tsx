"use client";

import { useState, useEffect } from "react";
import { characters, Character } from "@/lib/characters";
import { getLastMessagePreview, getLastMessageTime } from "@/lib/useConversations";
import Link from "next/link";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CharacterCard({ character }: { character: Character }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [lastTime, setLastTime] = useState<number | null>(null);

  useEffect(() => {
    setPreview(getLastMessagePreview(character.id));
    setLastTime(getLastMessageTime(character.id));
  }, [character.id]);

  return (
    <Link href={`/chat/${character.id}`} className="character-card">
      <div className="card-avatar-wrapper">
        <div className="card-avatar" style={{ background: character.gradient }}>
          {character.avatar}
        </div>
        <span
          className={`card-status-dot ${character.status}`}
          title={character.status}
        />
        {character.premium && <span className="premium-badge">PRO</span>}
      </div>
      <div className="card-info">
        <div className="card-header-row">
          <h3 className="card-name">{character.name}</h3>
          {lastTime && <span className="card-time">{timeAgo(lastTime)}</span>}
        </div>
        <p className="card-tagline">{character.tagline}</p>
        <p className="card-preview">
          {preview ?? character.messagePreview}
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");

  const filtered = characters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase()) ||
      c.occupation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app home-app">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-top">
          <h1 className="home-title">Companions</h1>
          <Link href="/settings" className="settings-button" aria-label="Settings">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search companions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Character List */}
      <main className="character-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No companions found</p>
          </div>
        ) : (
          filtered.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))
        )}
      </main>
    </div>
  );
}
