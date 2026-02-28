"use client";

import Link from "next/link";
import { companions } from "@/lib/companions";

export default function CompanionsPage() {
  return (
    <div className="companions-page">
      <div className="companions-header">
        <Link href="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="companions-title">Your Companions</h1>
          <p className="companions-subtitle">Choose someone to talk to</p>
        </div>
      </div>

      <div className="companions-grid">
        {companions.map((companion) => (
          <Link
            key={companion.id}
            href={companion.premium ? "/premium" : `/chat/${companion.id}`}
            className="companion-card"
          >
            {companion.premium && (
              <div className="premium-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                PREMIUM
              </div>
            )}
            <div
              className="companion-avatar"
              style={{ background: companion.gradient }}
            >
              {companion.avatar}
            </div>
            <div className="companion-info">
              <div className="companion-name-row">
                <h2 className="companion-name">{companion.name}</h2>
                <span className="companion-age">{companion.age}</span>
              </div>
              <p className="companion-tagline">{companion.tagline}</p>
              <p className="companion-description">{companion.description}</p>
              <div className="companion-interests">
                {companion.interests.map((interest) => (
                  <span key={interest} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="companion-personality">
                {companion.personality}
              </div>
            </div>
            {companion.premium && <div className="card-lock-overlay" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
