"use client";

interface Props {
  accent: [number, number, number];
}

export default function TypingDots({ accent }: Props) {
  const [r, g, b] = accent;
  return (
    <span className="typing-dots">
      <span style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)` }} />
      <span style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`, animationDelay: "0.15s" }} />
      <span style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`, animationDelay: "0.3s" }} />
    </span>
  );
}
