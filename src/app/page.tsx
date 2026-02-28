"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Ambient background orbs */}
      <div className="landing-orb orb-1" />
      <div className="landing-orb orb-2" />
      <div className="landing-orb orb-3" />

      <div className="landing-content">
        <div className="landing-badge">PREMIUM</div>
        <h1 className="landing-title">
          Connections that
          <br />
          feel <span className="landing-accent">real</span>
        </h1>
        <p className="landing-subtitle">
          Meet AI companions with genuine personalities, real opinions, and
          conversations that go deeper than small talk.
        </p>

        <Link href="/companions" className="landing-cta">
          Meet Your Companion
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="landing-features">
          <div className="landing-feature">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3>Genuine Personalities</h3>
            <p>Each companion has their own life, opinions, and story</p>
          </div>
          <div className="landing-feature">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Deep Conversations</h3>
            <p>Not scripted, not shallow — real back-and-forth</p>
          </div>
          <div className="landing-feature">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3>Premium Experience</h3>
            <p>Exclusive companions, priority responses, no limits</p>
          </div>
        </div>

        <div className="landing-social-proof">
          <div className="avatar-stack">
            {["M", "K", "L", "A", "R"].map((letter, i) => (
              <div
                key={letter}
                className="avatar-stack-item"
                style={{ zIndex: 5 - i }}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="social-proof-text">
            5 unique companions ready to chat
          </p>
        </div>
      </div>
    </div>
  );
}
