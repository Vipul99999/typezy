import { KeystrokeLogItem, LanguageCode, PacePoint, PracticeMode, SessionMetrics, SessionRecord, WeakMap } from "@/lib/types";

type ExportPayload = {
  version: 1;
  exportedAt: string;
  sessions: SessionRecord[];
};

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
const MAX_IMPORTED_SESSIONS = 5000;
const MAX_KEYSTROKES_PER_SESSION = 20000;
const MAX_PACE_POINTS_PER_SESSION = 7200;
const MAX_WEAK_MAP_ENTRIES = 250;
const MAX_STRING_LENGTH = 4000;

const ALLOWED_LANGUAGES: LanguageCode[] = ["en", "hi", "es", "fr", "de"];
const ALLOWED_MODES: PracticeMode[] = ["time", "words", "quote", "numbers", "punctuation", "custom", "code", "zen", "adaptive"];
const SESSION_KEYS = [
  "id",
  "completedAt",
  "language",
  "mode",
  "durationSec",
  "promptId",
  "promptPreview",
  "promptLength",
  "metrics",
  "pace",
  "weakKeys",
  "weakWords",
  "keystrokes"
] as const;
const METRICS_KEYS = [
  "grossWpm",
  "netWpm",
  "accuracy",
  "consistency",
  "errors",
  "extraChars",
  "missedChars",
  "correctChars",
  "totalTypedChars",
  "backspaceCount",
  "durationMs",
  "rawWpm",
  "burstWpm",
  "peakWpm",
  "errorRate"
] as const;
const PACE_KEYS = ["second", "grossWpm", "netWpm", "accuracy"] as const;
const KEYSTROKE_KEYS = ["key", "expected", "actual", "correct", "timestamp", "caretIndex"] as const;

export function serializeSessions(sessions: SessionRecord[]): string {
  const payload: ExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions
  };

  return JSON.stringify(payload, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowedKeys: readonly string[]) {
  return Object.keys(value).every((key) => allowedKeys.includes(key));
}

function hasExactKeys(value: Record<string, unknown>, allowedKeys: readonly string[]) {
  return Object.keys(value).length === allowedKeys.length && hasOnlyKeys(value, allowedKeys);
}

function clampNumber(value: unknown, min: number, max: number, fallback = min) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}

function sanitizeString(value: unknown, fallback = "", maxLength = MAX_STRING_LENGTH) {
  if (typeof value !== "string") {
    return fallback;
  }
  return value.slice(0, maxLength);
}

function sanitizeDate(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return undefined;
  }
  return new Date(timestamp).toISOString();
}

function sanitizeWeakMap(value: unknown): WeakMap {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, entryValue]) => typeof key === "string" && key.trim().length > 0 && typeof entryValue === "number" && Number.isFinite(entryValue))
      .slice(0, MAX_WEAK_MAP_ENTRIES)
      .map(([key, entryValue]) => [key.slice(0, 64), clampNumber(entryValue, 0, 100000, 0)])
  );
}

function sanitizeKeystroke(value: unknown): KeystrokeLogItem | undefined {
  if (!isRecord(value) || !hasExactKeys(value, KEYSTROKE_KEYS)) {
    return undefined;
  }

  const key = sanitizeString(value.key, "", 32);
  if (!key) {
    return undefined;
  }

  const expected = value.expected === null ? null : sanitizeString(value.expected, "", 32) || null;
  const actual = value.actual === null ? null : sanitizeString(value.actual, "", 32) || null;

  return {
    key,
    expected,
    actual,
    correct: Boolean(value.correct),
    timestamp: clampNumber(value.timestamp, 0, Number.MAX_SAFE_INTEGER, 0),
    caretIndex: clampNumber(value.caretIndex, 0, 100000, 0)
  };
}

function sanitizePacePoint(value: unknown): PacePoint | undefined {
  if (!isRecord(value) || !hasExactKeys(value, PACE_KEYS)) {
    return undefined;
  }

  return {
    second: clampNumber(value.second, 0, 36000, 0),
    grossWpm: clampNumber(value.grossWpm, 0, 400, 0),
    netWpm: clampNumber(value.netWpm, 0, 400, 0),
    accuracy: clampNumber(value.accuracy, 0, 100, 0)
  };
}

function sanitizeMetrics(value: unknown): SessionMetrics | undefined {
  if (!isRecord(value) || !hasExactKeys(value, METRICS_KEYS)) {
    return undefined;
  }

  return {
    grossWpm: clampNumber(value.grossWpm, 0, 400, 0),
    netWpm: clampNumber(value.netWpm, 0, 400, 0),
    accuracy: clampNumber(value.accuracy, 0, 100, 0),
    consistency: clampNumber(value.consistency, 0, 100, 0),
    errors: clampNumber(value.errors, 0, 100000, 0),
    extraChars: clampNumber(value.extraChars, 0, 100000, 0),
    missedChars: clampNumber(value.missedChars, 0, 100000, 0),
    correctChars: clampNumber(value.correctChars, 0, 100000, 0),
    totalTypedChars: clampNumber(value.totalTypedChars, 0, 100000, 0),
    backspaceCount: clampNumber(value.backspaceCount, 0, 100000, 0),
    durationMs: clampNumber(value.durationMs, 0, 4 * 60 * 60 * 1000, 0),
    rawWpm: clampNumber(value.rawWpm, 0, 400, 0),
    burstWpm: clampNumber(value.burstWpm, 0, 400, 0),
    peakWpm: clampNumber(value.peakWpm, 0, 400, 0),
    errorRate: clampNumber(value.errorRate, 0, 100, 0)
  };
}

function sanitizeSession(value: unknown): SessionRecord | undefined {
  if (!isRecord(value) || !hasExactKeys(value, SESSION_KEYS)) {
    return undefined;
  }

  const language = ALLOWED_LANGUAGES.includes(value.language as LanguageCode) ? (value.language as LanguageCode) : undefined;
  const mode = ALLOWED_MODES.includes(value.mode as PracticeMode) ? (value.mode as PracticeMode) : undefined;
  const completedAt = sanitizeDate(value.completedAt);
  const metrics = sanitizeMetrics(value.metrics);

  if (!language || !mode || !completedAt || !metrics) {
    return undefined;
  }

  const id = sanitizeString(value.id, "", 128);
  const promptId = sanitizeString(value.promptId, "", 128);
  if (!id || !promptId) {
    return undefined;
  }

  const keystrokes = Array.isArray(value.keystrokes)
    ? value.keystrokes
        .map(sanitizeKeystroke)
        .filter((entry): entry is KeystrokeLogItem => Boolean(entry))
        .slice(0, MAX_KEYSTROKES_PER_SESSION)
    : [];
  const pace = Array.isArray(value.pace)
    ? value.pace.map(sanitizePacePoint).filter((entry): entry is PacePoint => Boolean(entry)).slice(0, MAX_PACE_POINTS_PER_SESSION)
    : [];

  return {
    id,
    completedAt,
    language,
    mode,
    durationSec: clampNumber(value.durationSec, 1, 4 * 60 * 60, 1),
    promptId,
    promptPreview: sanitizeString(value.promptPreview, "", 180),
    promptLength: clampNumber(value.promptLength, 0, 100000, 0),
    metrics,
    pace,
    weakKeys: sanitizeWeakMap(value.weakKeys),
    weakWords: sanitizeWeakMap(value.weakWords),
    keystrokes
  };
}

export function parseImportedSessions(raw: string): SessionRecord[] {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("Import file is empty.");
  }

  if (new TextEncoder().encode(raw).byteLength > MAX_IMPORT_BYTES) {
    throw new Error("Import file is too large.");
  }

  const parsed = JSON.parse(raw) as Partial<ExportPayload>;
  if (!parsed || !Array.isArray(parsed.sessions)) {
    throw new Error("Invalid Typezy export format.");
  }

  if (parsed.sessions.length > MAX_IMPORTED_SESSIONS) {
    throw new Error("Import contains too many sessions.");
  }

  const sessions = parsed.sessions
    .map(sanitizeSession)
    .filter((session): session is SessionRecord => Boolean(session))
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt));

  if (!sessions.length && parsed.sessions.length > 0) {
    throw new Error("Import file does not contain valid Typezy sessions.");
  }

  return sessions;
}
