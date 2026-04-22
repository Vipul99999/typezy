"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentDifficulty, LanguageCode, PracticeMode } from "@/lib/types";

type SettingsState = {
  theme: "light" | "dark" | "system";
  language: LanguageCode;
  mode: PracticeMode;
  practiceView: "text" | "test" | "practice";
  contentDifficulty: ContentDifficulty;
  durationSeconds: number;
  wordCount: number;
  practiceLayout: "rich" | "pro";
  soundEnabled: boolean;
  fontScale: number;
  customText: string;
  reduceMotion: boolean;
  showLiveWpm: boolean;
  showKeyboardHints: boolean;
  caretStyle: "bar" | "block" | "underline";
  setTheme: (theme: SettingsState["theme"]) => void;
  setLanguage: (language: LanguageCode) => void;
  setMode: (mode: PracticeMode) => void;
  setPracticeView: (practiceView: SettingsState["practiceView"]) => void;
  setContentDifficulty: (contentDifficulty: ContentDifficulty) => void;
  setDurationSeconds: (durationSeconds: number) => void;
  setWordCount: (wordCount: number) => void;
  setPracticeLayout: (practiceLayout: SettingsState["practiceLayout"]) => void;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setFontScale: (fontScale: number) => void;
  setCustomText: (customText: string) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  setShowLiveWpm: (showLiveWpm: boolean) => void;
  setShowKeyboardHints: (showKeyboardHints: boolean) => void;
  setCaretStyle: (caretStyle: SettingsState["caretStyle"]) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      language: "en",
      mode: "time",
      practiceView: "practice",
      contentDifficulty: "intermediate",
      durationSeconds: 60,
      wordCount: 25,
      practiceLayout: "rich",
      soundEnabled: false,
      fontScale: 1,
      customText: "",
      reduceMotion: false,
      showLiveWpm: true,
      showKeyboardHints: true,
      caretStyle: "underline",
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setMode: (mode) => set({ mode }),
      setPracticeView: (practiceView) => set({ practiceView }),
      setContentDifficulty: (contentDifficulty) => set({ contentDifficulty }),
      setDurationSeconds: (durationSeconds) => set({ durationSeconds: Math.min(Math.max(durationSeconds, 15), 3600) }),
      setWordCount: (wordCount) => set({ wordCount: Math.min(Math.max(wordCount, 10), 1000) }),
      setPracticeLayout: (practiceLayout) => set({ practiceLayout }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setFontScale: (fontScale) => set({ fontScale }),
      setCustomText: (customText) => set({ customText }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setShowLiveWpm: (showLiveWpm) => set({ showLiveWpm }),
      setShowKeyboardHints: (showKeyboardHints) => set({ showKeyboardHints }),
      setCaretStyle: (caretStyle) => set({ caretStyle })
    }),
    {
      name: "typezy-settings"
    }
  )
);
