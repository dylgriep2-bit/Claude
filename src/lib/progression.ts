export interface UserProgress {
  userName: string;
  totalMessages: number;
  depthScore: number;
  moodsUsed: string[];
  songsShared: number;
  currentLevel: number;
  conversations: Record<string, ConversationMessage[]>;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  mood?: string;
  song?: { title: string; artist: string };
  timestamp: number;
}

const STORAGE_KEY = "rooftop_progress";

export function getDefaultProgress(): UserProgress {
  return {
    userName: "",
    totalMessages: 0,
    depthScore: 0,
    moodsUsed: [],
    songsShared: 0,
    currentLevel: 1,
    conversations: {},
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function calculateLevel(progress: UserProgress): number {
  const { totalMessages, depthScore, moodsUsed, songsShared } = progress;

  if (totalMessages >= 50 && depthScore > 40 && moodsUsed.length >= 4 && songsShared >= 2) return 5;
  if (totalMessages >= 35 && depthScore > 25 && songsShared >= 1) return 4;
  if (totalMessages >= 20 && depthScore > 15 && moodsUsed.length >= 3) return 3;
  if (totalMessages >= 8 && depthScore > 5) return 2;
  return 1;
}

export function addMessage(
  progress: UserProgress,
  spaceId: string,
  message: ConversationMessage
): UserProgress {
  const conversations = { ...progress.conversations };
  if (!conversations[spaceId]) conversations[spaceId] = [];
  conversations[spaceId] = [...conversations[spaceId], message];

  let depthDelta = 0;
  if (message.role === "user") {
    // longer messages = more depth
    if (message.content.length > 100) depthDelta += 2;
    else if (message.content.length > 40) depthDelta += 1;
    // questions show engagement
    if (message.content.includes("?")) depthDelta += 0.5;
    // vulnerability keywords
    const vulnerable = ["feel", "scared", "miss", "love", "hurt", "wish", "afraid", "lonely", "sorry", "remember", "dream", "cry", "lost"];
    if (vulnerable.some((w) => message.content.toLowerCase().includes(w))) depthDelta += 1.5;
  }

  const moodsUsed = message.mood
    ? [...new Set([...progress.moodsUsed, message.mood])]
    : progress.moodsUsed;

  const songsShared = message.song
    ? progress.songsShared + 1
    : progress.songsShared;

  const totalMessages =
    message.role === "user" ? progress.totalMessages + 1 : progress.totalMessages;

  const updated: UserProgress = {
    ...progress,
    totalMessages,
    depthScore: progress.depthScore + depthDelta,
    moodsUsed,
    songsShared,
    conversations,
  };

  updated.currentLevel = Math.max(progress.currentLevel, calculateLevel(updated));
  return updated;
}

export function getProgressLabel(level: number): string {
  switch (level) {
    case 1: return "just beginning";
    case 2: return "opening up";
    case 3: return "getting close";
    case 4: return "walls coming down";
    case 5: return "no walls left";
    default: return "just beginning";
  }
}

export function getNextUnlockHint(progress: UserProgress): string | null {
  const nextLevel = progress.currentLevel + 1;
  if (nextLevel > 5) return null;

  switch (nextLevel) {
    case 2: {
      const msgsNeeded = Math.max(0, 8 - progress.totalMessages);
      const depthNeeded = Math.max(0, Math.ceil(5 - progress.depthScore));
      if (msgsNeeded > 0) return `${msgsNeeded} more messages to go`;
      if (depthNeeded > 0) return `go a little deeper`;
      return "almost there...";
    }
    case 3: {
      const msgsNeeded = Math.max(0, 20 - progress.totalMessages);
      const moodsNeeded = Math.max(0, 3 - progress.moodsUsed.length);
      if (msgsNeeded > 0) return `${msgsNeeded} more messages`;
      if (moodsNeeded > 0) return `try ${moodsNeeded} more moods`;
      return "keep going deeper...";
    }
    case 4: {
      if (progress.songsShared < 1) return "share a song";
      return "keep building depth";
    }
    case 5: {
      if (progress.songsShared < 2) return "share more music";
      if (progress.moodsUsed.length < 4) return "explore more moods";
      return "keep being real";
    }
    default:
      return null;
  }
}
