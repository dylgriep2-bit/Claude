"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "companion-conversations";

export default function SettingsPage() {
  const router = useRouter();
  const [cleared, setCleared] = useState(false);

  const handleClearAll = () => {
    if (confirm("Clear all conversation history? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    }
  };

  return (
    <div className="app settings-app">
      <header className="settings-header">
        <button
          className="back-button"
          onClick={() => router.push("/")}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="settings-title">Settings</h1>
      </header>

      <main className="settings-content">
        <section className="settings-section">
          <h2 className="settings-section-title">General</h2>

          <div className="settings-item">
            <div className="settings-item-info">
              <h3>App Version</h3>
              <p>Companion Premium v1.0.0</p>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Data</h2>

          <button className="settings-danger-button" onClick={handleClearAll}>
            {cleared ? "Cleared!" : "Clear All Conversations"}
          </button>
          <p className="settings-hint">
            This permanently deletes all message history with all companions.
          </p>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">About</h2>
          <div className="settings-item">
            <div className="settings-item-info">
              <h3>Companion</h3>
              <p>Premium AI companionship, crafted with care. Your conversations stay on your device.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
