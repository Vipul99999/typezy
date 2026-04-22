"use client";

import { create } from "zustand";
import { buildPrompt } from "@/lib/content/languages";
import { evaluateAttempt, buildPaceSeries } from "@/lib/typing/engine";
import { splitGraphemes } from "@/lib/typing/graphemes";
import { getTypedCompletedWordCount, hasCompletedWordTarget } from "@/lib/typing/word-engine";
import { KeystrokeLogItem, PracticePrompt, PracticeMode, SessionRecord, TypingStatus } from "@/lib/types";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useStatsStore } from "@/stores/useStatsStore";

type Snapshot = { typedText: string; elapsedMs: number };

type TypingState = {
  status: TypingStatus;
  prompt: PracticePrompt;
  typedText: string;
  keystrokes: KeystrokeLogItem[];
  startedAt?: number;
  elapsedMs: number;
  backspaceCount: number;
  snapshots: Snapshot[];
  lastSession?: SessionRecord;
  startSession: (mode?: PracticeMode) => void;
  updateTypedText: (typedText: string) => void;
  registerBackspace: () => void;
  tick: () => void;
  finishSession: () => void;
  restartSession: () => void;
  injectKeystroke: (key: string) => void;
};

function createInitialPrompt(): PracticePrompt {
  const settings = useSettingsStore.getState();
  const summary = useStatsStore.getState().summary;
  return buildPrompt(
    settings.language,
    settings.mode,
    settings.customText,
    summary.weakKeys,
    summary.weakWords,
    settings.wordCount,
    settings.durationSeconds,
    settings.practiceView,
    settings.contentDifficulty
  );
}

export const useTypingStore = create<TypingState>()((set, get) => ({
  status: "idle",
  prompt: createInitialPrompt(),
  typedText: "",
  keystrokes: [],
  elapsedMs: 0,
  backspaceCount: 0,
  snapshots: [],
  lastSession: undefined,
  startSession: (mode) => {
    const settings = useSettingsStore.getState();
    const state = get();
    const selectedMode = mode || settings.mode;
    const summary = useStatsStore.getState().summary;
    const shouldReuseVisiblePrompt =
      !mode &&
      state.prompt.language === settings.language &&
      state.prompt.mode === settings.mode;
    const prompt = shouldReuseVisiblePrompt
      ? state.prompt
      : buildPrompt(
          settings.language,
          selectedMode,
          settings.customText,
          summary.weakKeys,
          summary.weakWords,
          settings.wordCount,
          settings.durationSeconds,
          settings.practiceView,
          settings.contentDifficulty
        );
    set({
      status: "running",
      prompt,
      typedText: "",
      keystrokes: [],
      startedAt: Date.now(),
      elapsedMs: 0,
      backspaceCount: 0,
      snapshots: []
    });
  },
  updateTypedText: (typedText) => {
    const state = get();
    if (state.status === "idle") {
      get().startSession();
    }

    const current = get();
    const startedAt = current.startedAt || Date.now();
    const elapsedMs = Date.now() - startedAt;
    const snapshots = [...current.snapshots];
    const secondMark = Math.floor(elapsedMs / 1000);
    if (secondMark > 0 && snapshots.length < secondMark) {
      snapshots.push({ typedText, elapsedMs });
    }

    const previous = current.typedText;
    const targetSegments = splitGraphemes(current.prompt.text);
    const previousSegments = splitGraphemes(previous);
    const currentSegments = splitGraphemes(typedText);
    const previousLength = previousSegments.length;
    const currentLength = currentSegments.length;
    const nextKey = currentLength > previousLength ? currentSegments.at(-1) || "" : "Backspace";
    const expected = targetSegments.at(Math.max(currentLength - 1, 0)) || null;
    const actual = currentLength > previousLength ? currentSegments.at(-1) || null : null;
    const keystrokes = [
      ...current.keystrokes,
      {
        key: nextKey,
        expected,
        actual,
        correct: expected === actual,
        timestamp: Date.now(),
        caretIndex: currentLength
      }
    ];

    set({
      typedText,
      elapsedMs,
      snapshots,
      keystrokes
    });

    const settings = useSettingsStore.getState();
    const targetWordGoal = current.prompt.wordCount || settings.wordCount;
    const completedWords = getTypedCompletedWordCount(typedText, current.prompt.text);
    const reachedTargetLength = currentSegments.length >= targetSegments.length;
    const shouldFinishWordsMode =
      settings.mode === "words" &&
      (completedWords >= targetWordGoal || hasCompletedWordTarget(typedText, current.prompt.text, targetWordGoal)) &&
      typedText.trim().length > 0;
    const shouldFinishTextMode =
      settings.mode !== "time" && settings.mode !== "words" && reachedTargetLength;

    if (shouldFinishWordsMode || shouldFinishTextMode) {
      get().finishSession();
    }
  },
  registerBackspace: () => {
    set((state) => ({ backspaceCount: state.backspaceCount + 1 }));
  },
  tick: () => {
    const state = get();
    if (state.status !== "running" || !state.startedAt) {
      return;
    }

    const elapsedMs = Date.now() - state.startedAt;
    set({ elapsedMs });

    const durationSeconds = useSettingsStore.getState().durationSeconds;
    if (useSettingsStore.getState().mode === "time" && elapsedMs >= durationSeconds * 1000) {
      state.finishSession();
    }
  },
  finishSession: () => {
    const state = get();
    if (state.status === "finished") {
      return;
    }

    const completedAt = new Date().toISOString();
    const evaluation = evaluateAttempt(
      state.prompt.text,
      state.typedText,
      Math.max(state.elapsedMs, 1000),
      state.backspaceCount,
      state.keystrokes
    );
    const session: SessionRecord = {
      id: crypto.randomUUID(),
      completedAt,
      language: state.prompt.language,
      mode: state.prompt.mode,
      durationSec: Math.max(1, Math.round(state.elapsedMs / 1000)),
      promptId: state.prompt.id,
      promptPreview: state.prompt.text.slice(0, 120),
      promptLength: state.prompt.text.length,
      metrics: {
        grossWpm: evaluation.grossWpm,
        netWpm: evaluation.netWpm,
        accuracy: evaluation.accuracy,
        consistency: evaluation.consistency,
        errors: evaluation.errors,
        extraChars: evaluation.extraChars,
        missedChars: evaluation.missedChars,
        correctChars: evaluation.correctChars,
        totalTypedChars: evaluation.totalTypedChars,
        backspaceCount: evaluation.backspaceCount,
        durationMs: evaluation.durationMs,
        rawWpm: evaluation.rawWpm,
        burstWpm: evaluation.burstWpm,
        peakWpm: evaluation.peakWpm,
        errorRate: evaluation.errorRate
      },
      pace: buildPaceSeries(state.prompt.text, state.snapshots),
      weakKeys: evaluation.weakKeys,
      weakWords: evaluation.weakWords,
      keystrokes: state.keystrokes
    };

    void useStatsStore.getState().recordSession(session);

    set({
      status: "finished",
      lastSession: session
    });
  },
  restartSession: () => {
    const settings = useSettingsStore.getState();
    const summary = useStatsStore.getState().summary;
    const prompt = buildPrompt(
      settings.language,
      settings.mode,
      settings.customText,
      summary.weakKeys,
      summary.weakWords,
      settings.wordCount,
      settings.durationSeconds,
      settings.practiceView,
      settings.contentDifficulty
    );
    set({
      status: "idle",
      prompt,
      typedText: "",
      keystrokes: [],
      startedAt: undefined,
      elapsedMs: 0,
      backspaceCount: 0,
      snapshots: []
    });
  },
  injectKeystroke: (key) => {
    const state = get();
    if (!key) {
      return;
    }

    const nextTypedText = key === " " ? `${state.typedText} ` : `${state.typedText}${key}`;
    get().updateTypedText(nextTypedText);
  }
}));
