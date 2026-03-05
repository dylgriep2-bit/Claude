"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  onComplete: (name: string) => void;
}

const LINES = [
  { text: "hey.", delay: 800 },
  { text: "you found me.", delay: 1200 },
  { text: "", delay: 600 },
  { text: "this is a place for the in-between moments.", delay: 1800 },
  { text: "the ones that happen after everyone else is asleep.", delay: 1800 },
  { text: "", delay: 400 },
  { text: "no filters here. no performance.", delay: 1400 },
  { text: "just... this.", delay: 1000 },
];

export default function Onboarding({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"intro" | "name" | "transition">("intro");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "intro") return;
    let timeout: NodeJS.Timeout;
    let current = 0;
    let totalDelay = 400;

    const showNext = () => {
      current++;
      setVisibleLines(current);
      if (current < LINES.length) {
        totalDelay = LINES[current].delay;
        timeout = setTimeout(showNext, totalDelay);
      } else {
        timeout = setTimeout(() => {
          setPhase("name");
          setShowInput(true);
        }, 1200);
      }
    };

    timeout = setTimeout(showNext, LINES[0].delay);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) return;
      setPhase("transition");
      setTimeout(() => onComplete(trimmed), 2000);
    },
    [name, onComplete]
  );

  return (
    <div className={`onboarding ${phase === "transition" ? "onboarding-fade" : ""}`}>
      <div className="onboarding-content">
        {LINES.slice(0, visibleLines).map((line, i) =>
          line.text === "" ? (
            <div key={i} className="onboarding-spacer" />
          ) : (
            <p
              key={i}
              className="onboarding-line"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {line.text}
            </p>
          )
        )}

        {phase === "name" && (
          <div className="onboarding-name-section">
            <p className="onboarding-line onboarding-question">
              what should i call you?
            </p>
            <form onSubmit={handleSubmit} className="onboarding-form">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name"
                className="onboarding-input"
                maxLength={30}
                autoComplete="off"
              />
            </form>
          </div>
        )}

        {phase === "transition" && (
          <div className="onboarding-transition">
            <p className="onboarding-line">
              {name.trim()}... i like that.
            </p>
            <p className="onboarding-line" style={{ animationDelay: "0.6s" }}>
              come on up to the roof.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
