"use client";

import { use } from "react";
import { getCharacter } from "@/lib/characters";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = use(params);
  const character = getCharacter(characterId);
  const router = useRouter();

  if (!character) {
    return (
      <div className="app">
        <div className="empty-state">
          <p>Companion not found</p>
          <Link href="/" className="back-link">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app profile-app">
      {/* Hero */}
      <div className="profile-hero" style={{ background: character.gradient }}>
        <button
          className="back-button profile-back"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="profile-avatar-large">
          {character.avatar}
        </div>
        <h1 className="profile-name">{character.name}</h1>
        <p className="profile-tagline">{character.tagline}</p>
        <div className="profile-meta">
          <span>{character.age} years old</span>
          <span className="meta-dot" />
          <span>{character.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        <section className="profile-section">
          <h2 className="section-title">About</h2>
          <p className="section-text">{character.bio}</p>
          <p className="section-occupation">{character.occupation}</p>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Personality</h2>
          <div className="tag-grid">
            {character.personality.map((trait) => (
              <span key={trait} className="tag" style={{ borderColor: character.accentColor, color: character.accentColor }}>
                {trait}
              </span>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Interests</h2>
          <div className="tag-grid">
            {character.interests.map((interest) => (
              <span key={interest} className="tag filled" style={{ background: character.accentColor + "22", color: character.accentColor, borderColor: character.accentColor + "44" }}>
                {interest}
              </span>
            ))}
          </div>
        </section>

        <Link
          href={`/chat/${character.id}`}
          className="profile-cta"
          style={{ background: character.gradient }}
        >
          Message {character.name}
        </Link>
      </div>
    </div>
  );
}
