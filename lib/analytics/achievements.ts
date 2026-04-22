import { Achievement, SessionRecord } from "@/lib/types";

export function buildAchievements(sessions: SessionRecord[]): Achievement[] {
  const unlockedAt = (session?: SessionRecord) => session?.completedAt;
  const highSpeed = sessions.find((session) => session.metrics.netWpm >= 50);
  const highAccuracy = sessions.find((session) => session.metrics.accuracy >= 95);
  const noBackspace = sessions.find((session) => session.metrics.backspaceCount === 0);
  const multilingual = sessions.reduce<Set<string>>((accumulator, session) => accumulator.add(session.language), new Set());

  return [
    {
      id: "first-session",
      title: "First Session",
      description: "Complete your first Typezy practice session.",
      unlockedAt: unlockedAt(sessions[0])
    },
    {
      id: "50-wpm",
      title: "50 WPM Club",
      description: "Reach at least 50 net WPM in any session.",
      unlockedAt: unlockedAt(highSpeed)
    },
    {
      id: "95-accuracy",
      title: "95% Accuracy",
      description: "Finish a session with 95% or higher accuracy.",
      unlockedAt: unlockedAt(highAccuracy)
    },
    {
      id: "no-backspace",
      title: "No-Backspace Run",
      description: "Complete a full session without using backspace.",
      unlockedAt: unlockedAt(noBackspace)
    },
    {
      id: "multilingual",
      title: "Multilingual Learner",
      description: "Practice in at least three different languages.",
      progress: multilingual.size / 3,
      unlockedAt: multilingual.size >= 3 ? unlockedAt(sessions.find((session) => session.language)) : undefined
    }
  ];
}
