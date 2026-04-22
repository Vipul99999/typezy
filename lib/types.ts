export type LanguageCode = "en" | "hi" | "es" | "fr" | "de";
export type ScriptType = "latin" | "devanagari";
export type TextDirection = "ltr" | "rtl";

export type PracticeMode =
  | "time"
  | "words"
  | "quote"
  | "numbers"
  | "punctuation"
  | "custom"
  | "code"
  | "zen"
  | "adaptive";

export type ContentDifficulty = "beginner" | "intermediate" | "advanced";

export type TypingStatus = "idle" | "running" | "paused" | "finished";

export type LanguageConfig = {
  id: LanguageCode;
  name: string;
  nativeName: string;
  script: ScriptType;
  direction: TextDirection;
  locale: string;
  defaultFontClass: string;
  supportsQuotes: boolean;
  supportsCodeMode: boolean;
  supportsNumbersMode: boolean;
  supportsPunctuationMode: boolean;
  wordSourceVersion: string;
  keyboardNotes: string;
};

export type DifficultyContentPack = {
  words: string[];
  sentences: string[];
  quotes: string[];
  punctuation: string[];
  numbers: string[];
  code: string[];
};

export type LanguageContentLibrary = Record<ContentDifficulty, DifficultyContentPack>;

export type PracticePrompt = {
  id: string;
  language: LanguageCode;
  mode: PracticeMode;
  source: string;
  text: string;
  wordCount?: number;
};

export type PacePoint = {
  second: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
};

export type SessionMetrics = {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  extraChars: number;
  missedChars: number;
  correctChars: number;
  totalTypedChars: number;
  backspaceCount: number;
  durationMs: number;
  rawWpm: number;
  burstWpm: number;
  peakWpm: number;
  errorRate: number;
};

export type WeakMap = Record<string, number>;

export type KeystrokeLogItem = {
  key: string;
  expected: string | null;
  actual: string | null;
  correct: boolean;
  timestamp: number;
  caretIndex: number;
};

export type SessionRecord = {
  id: string;
  completedAt: string;
  language: LanguageCode;
  mode: PracticeMode;
  durationSec: number;
  promptId: string;
  promptPreview: string;
  promptLength: number;
  metrics: SessionMetrics;
  pace: PacePoint[];
  weakKeys: WeakMap;
  weakWords: WeakMap;
  keystrokes: KeystrokeLogItem[];
};

export type Recommendation = {
  id: string;
  title: string;
  body: string;
  mode: PracticeMode;
  language?: LanguageCode;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  progress?: number;
};

export type StatsSummary = {
  totalSessions: number;
  totalPracticeMinutes: number;
  streakDays: number;
  currentStreakStart?: string;
  bestNetWpm: Partial<Record<LanguageCode, number>>;
  bestAccuracy: Partial<Record<LanguageCode, number>>;
  sessionsByLanguage: Partial<Record<LanguageCode, number>>;
  sessionsByMode: Partial<Record<PracticeMode, number>>;
  weakKeys: WeakMap;
  weakWords: WeakMap;
};
