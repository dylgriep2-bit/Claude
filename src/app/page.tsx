"use client";

import { useState, useEffect, useCallback } from "react";
import { Space } from "@/lib/spaces";
import { UserProgress, loadProgress, saveProgress } from "@/lib/progression";
import Onboarding from "@/components/Onboarding";
import HomeScreen from "@/components/HomeScreen";
import ChatSpace from "@/components/ChatSpace";

type AppView = "loading" | "onboarding" | "home" | "chat";

export default function Page() {
  const [view, setView] = useState<AppView>("loading");
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const saved = loadProgress();
    setProgress(saved);
    setView(saved.userName ? "home" : "onboarding");
  }, []);

  const handleOnboardingComplete = useCallback((name: string) => {
    const p = loadProgress();
    p.userName = name;
    saveProgress(p);
    setProgress(p);
    setTransitioning(true);
    setTimeout(() => {
      setView("home");
      setTransitioning(false);
    }, 300);
  }, []);

  const handleSelectSpace = useCallback((space: Space) => {
    setActiveSpace(space);
    setTransitioning(true);
    setTimeout(() => {
      setView("chat");
      setTransitioning(false);
    }, 300);
  }, []);

  const handleBack = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setView("home");
      setActiveSpace(null);
      setTransitioning(false);
    }, 300);
  }, []);

  const handleProgressUpdate = useCallback((updated: UserProgress) => {
    setProgress(updated);
  }, []);

  if (view === "loading" || !progress) {
    return <div className="app-loading" />;
  }

  return (
    <div className={`app ${transitioning ? "app-transitioning" : ""}`}>
      {view === "onboarding" && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {view === "home" && (
        <HomeScreen progress={progress} onSelectSpace={handleSelectSpace} />
      )}
      {view === "chat" && activeSpace && (
        <ChatSpace
          space={activeSpace}
          progress={progress}
          onProgressUpdate={handleProgressUpdate}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
