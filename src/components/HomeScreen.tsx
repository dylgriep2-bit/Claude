"use client";

import { SPACES, Space } from "@/lib/spaces";
import { UserProgress, getProgressLabel, getNextUnlockHint } from "@/lib/progression";

interface Props {
  progress: UserProgress;
  onSelectSpace: (space: Space) => void;
}

export default function HomeScreen({ progress, onSelectSpace }: Props) {
  const unlockedCount = progress.currentLevel;
  const label = getProgressLabel(progress.currentLevel);
  const hint = getNextUnlockHint(progress);

  const hour = new Date().getHours();
  let greeting: string;
  if (hour >= 5 && hour < 12) greeting = "morning";
  else if (hour >= 12 && hour < 17) greeting = "hey";
  else if (hour >= 17 && hour < 21) greeting = "evening";
  else greeting = "hey, night owl";

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-greeting">
          {greeting}, {progress.userName}.
        </h1>
        <div className="home-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(unlockedCount / 5) * 100}%` }}
            />
          </div>
          <span className="progress-label">
            {unlockedCount}/5 spaces — {label}
          </span>
        </div>
      </div>

      <div className="space-grid">
        {SPACES.map((space) => {
          const unlocked = space.level <= progress.currentLevel;
          const [r, g, b] = space.accent;
          const msgCount = progress.conversations[space.id]?.filter((m) => m.role === "user").length || 0;

          return (
            <button
              key={space.id}
              className={`space-card ${unlocked ? "space-unlocked" : "space-locked"}`}
              onClick={() => unlocked && onSelectSpace(space)}
              disabled={!unlocked}
              style={
                unlocked
                  ? {
                      borderColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                      background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.06) 0%, rgba(0,0,0,0) 100%)`,
                    }
                  : {}
              }
            >
              <div className="space-card-inner">
                <div
                  className="space-card-glow"
                  style={
                    unlocked
                      ? { background: `radial-gradient(circle at 30% 30%, rgba(${r}, ${g}, ${b}, 0.1), transparent 70%)` }
                      : {}
                  }
                />
                <div className="space-card-content">
                  <span className="space-level">
                    {unlocked ? `level ${space.level}` : "locked"}
                  </span>
                  <h2 className="space-name">{space.name}</h2>
                  <p className="space-tagline">{space.tagline}</p>
                  {unlocked && msgCount > 0 && (
                    <span className="space-msg-count">
                      {msgCount} {msgCount === 1 ? "message" : "messages"}
                    </span>
                  )}
                  {!unlocked && (
                    <span className="space-unlock-hint">
                      {space.unlockHint}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {hint && (
        <p className="home-hint">next unlock: {hint}</p>
      )}
    </div>
  );
}
