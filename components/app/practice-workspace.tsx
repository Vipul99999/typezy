"use client";

import { type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, RotateCcw, Settings2 } from "lucide-react";
import { playTypeSound, warmTypeSound } from "@/lib/audio/type-sounds";
import { buildPrompt, LANGUAGES } from "@/lib/content/languages";
import { evaluateAttempt } from "@/lib/typing/engine";
import { splitGraphemes } from "@/lib/typing/graphemes";
import { getStrictTargetWordScore } from "@/lib/typing/word-engine";
import { LanguageCode, PracticeMode } from "@/lib/types";
import { cn } from "@/lib/utils/format";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useStatsStore } from "@/stores/useStatsStore";
import { useTypingStore } from "@/stores/useTypingStore";

const DURATION_PRESETS = [30, 60, 120, 300, 600, 900, 1800] as const;
const WORD_PRESETS = [10, 25, 50, 100, 200, 500, 1000] as const;
const DIFFICULTY_OPTIONS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" }
] as const;
const PRIMARY_MODES: PracticeMode[] = ["time", "words", "quote", "adaptive"];
const SECONDARY_MODES: PracticeMode[] = ["numbers", "punctuation", "code", "zen", "custom"];
const VIEW_MODES = [
  { id: "text", label: "Text Mode", note: "Focus and realism" },
  { id: "test", label: "Test Mode", note: "Performance measurement" },
  { id: "practice", label: "Practice Mode", note: "Skill building" }
] as const;
const MODE_SHORTCUTS: Record<string, PracticeMode> = {
  q: "time",
  w: "words",
  e: "quote",
  a: "adaptive",
  n: "numbers",
  p: "punctuation",
  c: "code",
  z: "zen",
  x: "custom"
};

function getCompletionInsight(netWpm: number, accuracy: number, consistency: number) {
  if (accuracy < 90) {
    return "Accuracy dropped under control range. Slow slightly and keep the next run clean.";
  }
  if (consistency < 75) {
    return "Speed is there, but the rhythm moved around. Try a calmer steady run next.";
  }
  if (netWpm >= 60 && accuracy >= 96) {
    return "Strong control. You are ready for a longer session or a harder pack.";
  }
  return "Clean session. Repeat once more and try to hold this rhythm a little longer.";
}

function formatDurationLabel(seconds: number) {
  return seconds >= 60 ? `${Math.round(seconds / 60)}m` : `${seconds}s`;
}

function clampCustomMinutes(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(Math.max(Math.round(value), 1), 60);
}

function cycleValue<T>(values: readonly T[], current: T, direction: 1 | -1) {
  const currentIndex = Math.max(values.indexOf(current), 0);
  const nextIndex = (currentIndex + direction + values.length) % values.length;
  return values[nextIndex];
}

function shouldIgnoreGlobalShortcut(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }

  if (element instanceof HTMLTextAreaElement && element.dataset.practiceInput === "true") {
    return false;
  }

  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement ||
    element.isContentEditable
  );
}

function findStableWindowStart(segments: string[], targetIndex: number) {
  const nextStart = Math.max(0, targetIndex);
  for (let index = nextStart; index > Math.max(0, nextStart - 24); index -= 1) {
    if (segments[index] === " ") {
      return index + 1;
    }
  }
  return nextStart;
}

function keepTypingFocus(event: ReactMouseEvent<HTMLElement>) {
  event.preventDefault();
}

export function PracticeWorkspace({ initialLanguage }: { initialLanguage?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const blurRefocusTimerRef = useRef<number | null>(null);
  const router = useRouter();
  const settings = useSettingsStore();
  const weakKeys = useStatsStore((state) => state.summary.weakKeys);
  const weakWords = useStatsStore((state) => state.summary.weakWords);
  const recommendations = useStatsStore((state) => state.recommendations);
  const [showSetupDrawer, setShowSetupDrawer] = useState(false);
  const [windowStart, setWindowStart] = useState(0);
  const [showFinishToast, setShowFinishToast] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const {
    prompt,
    typedText,
    status,
    elapsedMs,
    lastSession,
    startSession,
    updateTypedText,
    registerBackspace,
    tick,
    restartSession,
    finishSession,
    injectKeystroke
  } = useTypingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nextPrompt = buildPrompt(
      settings.language,
      settings.mode,
      settings.customText,
      weakKeys,
      weakWords,
      settings.wordCount,
      settings.durationSeconds,
      settings.practiceView,
      settings.contentDifficulty
    );
    if (status === "idle") {
      useTypingStore.setState({ prompt: nextPrompt });
    }
  }, [
    settings.language,
    settings.mode,
    settings.customText,
    settings.wordCount,
    settings.durationSeconds,
    settings.practiceView,
    settings.contentDifficulty,
    weakKeys,
    weakWords,
    status
  ]);

  useEffect(() => {
    const focusTextarea = () => {
      textareaRef.current?.focus();
    };

    focusTextarea();
    const timeout = window.setTimeout(focusTextarea, 60);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    return () => {
      if (blurRefocusTimerRef.current) {
        window.clearTimeout(blurRefocusTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sessionNotice) {
      return;
    }
    const timeout = window.setTimeout(() => setSessionNotice(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [sessionNotice]);

  useEffect(() => {
    if (initialLanguage && initialLanguage in LANGUAGES && initialLanguage !== settings.language) {
      settings.setLanguage(initialLanguage as keyof typeof LANGUAGES);
    }
  }, [initialLanguage, settings]);

  useEffect(() => {
    if (status === "running") {
      setShowSetupDrawer(false);
    }
  }, [status]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.location.href = "/settings";
        return;
      }

      if (shouldIgnoreGlobalShortcut(event.target)) {
        return;
      }

      if (event.key === "Tab" || event.key === "Escape") {
        event.preventDefault();
        restartSession();
        textareaRef.current?.focus();
        return;
      }

      if (!event.altKey) {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      if (pressedKey >= "1" && pressedKey <= "7") {
        event.preventDefault();
        settings.setDurationSeconds(DURATION_PRESETS[Number(pressedKey) - 1]);
        restartSession();
        textareaRef.current?.focus();
        return;
      }

      if (pressedKey in MODE_SHORTCUTS) {
        event.preventDefault();
        settings.setMode(MODE_SHORTCUTS[pressedKey]);
        restartSession();
        textareaRef.current?.focus();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const languages = Object.keys(LANGUAGES) as LanguageCode[];
        settings.setLanguage(cycleValue(languages, settings.language, event.key === "ArrowRight" ? 1 : -1));
        restartSession();
        textareaRef.current?.focus();
        return;
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        settings.setWordCount(cycleValue(WORD_PRESETS, settings.wordCount, -1));
        restartSession();
        textareaRef.current?.focus();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        settings.setWordCount(cycleValue(WORD_PRESETS, settings.wordCount, 1));
        restartSession();
        textareaRef.current?.focus();
        return;
      }

      if (pressedKey === "0") {
        event.preventDefault();
        settings.setPracticeLayout(settings.practiceLayout === "pro" ? "rich" : "pro");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [restartSession, settings]);

  useEffect(() => {
    const handleGlobalTypeCapture = (event: KeyboardEvent) => {
      if (shouldIgnoreGlobalShortcut(event.target)) {
        return;
      }

      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const isPrintable = event.key.length === 1;
      const isBackspace = event.key === "Backspace";
      if (!isPrintable && !isBackspace) {
        return;
      }

      const activeElement = document.activeElement;
      const textareaFocused = activeElement instanceof HTMLTextAreaElement && activeElement.dataset.practiceInput === "true";
      if (textareaFocused) {
        return;
      }

      event.preventDefault();
      textareaRef.current?.focus();

      if (isBackspace) {
        if (typedText.length > 0) {
          if (settings.soundEnabled) {
            void playTypeSound("backspace");
          }
          registerBackspace();
          updateTypedText(typedText.slice(0, -1));
        }
        return;
      }

      if (settings.soundEnabled) {
        void warmTypeSound();
        void playTypeSound("type");
      }
      injectKeystroke(event.key);
    };

    window.addEventListener("keydown", handleGlobalTypeCapture, true);
    return () => window.removeEventListener("keydown", handleGlobalTypeCapture, true);
  }, [injectKeystroke, registerBackspace, settings.soundEnabled, typedText, updateTypedText]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = window.setInterval(() => tick(), 200);
    return () => window.clearInterval(interval);
  }, [status, tick]);

  const promptGraphemes = useMemo(() => splitGraphemes(prompt.text), [prompt.text]);
  const typedGraphemes = useMemo(() => splitGraphemes(typedText), [typedText]);
  const liveMetrics = useMemo(
    () => evaluateAttempt(prompt.text, typedText, Math.max(elapsedMs, 1000), 0),
    [prompt.text, typedText, elapsedMs]
  );

  const typedLength = typedGraphemes.length;
  const isRunning = status === "running";
  const isFinished = status === "finished" && !!lastSession;
  const isTypingActive = isRunning || typedLength > 0;
  const isPro = settings.practiceLayout === "pro";
  const isTextView = settings.practiceView === "text";
  const isTestView = settings.practiceView === "test";
  const currentView = VIEW_MODES.find((view) => view.id === settings.practiceView) || VIEW_MODES[2];
  const windowSize = isPro ? 240 : 320;
  const revealLead = isPro ? 150 : 210;
  const trailingBuffer = isPro ? 36 : 56;
  const windowEnd = Math.min(promptGraphemes.length, windowStart + windowSize);
  const visiblePrompt = promptGraphemes.slice(windowStart, windowEnd);
  const displayedPrompt = isFinished ? promptGraphemes : visiblePrompt;
  const targetWordGoal = prompt.wordCount || settings.wordCount;
  const strictWordScore = useMemo(
    () => getStrictTargetWordScore(typedText, prompt.text, targetWordGoal, { finalizeActiveToken: isFinished }),
    [isFinished, typedText, prompt.text, targetWordGoal]
  );
  const remainingSeconds = Math.max(settings.durationSeconds - Math.floor(elapsedMs / 1000), 0);
  const progressLabel =
    settings.mode === "words" || settings.mode === "adaptive"
      ? `${strictWordScore.attemptedWords}/${targetWordGoal} words`
      : `${remainingSeconds}s`;
  const cleanWordsLabel =
    settings.mode === "words" || settings.mode === "adaptive"
      ? `${strictWordScore.cleanWords} clean`
      : null;
  const wrongWordsLabel =
    settings.mode === "words" || settings.mode === "adaptive"
      ? `${strictWordScore.wrongWords} wrong`
      : null;
  const missedWordsLabel =
    settings.mode === "words" || settings.mode === "adaptive"
      ? `${strictWordScore.remainingWords} remaining`
      : null;
  const durationLabel = formatDurationLabel(settings.durationSeconds);
  const topStatTone: "idle" | "active" | "finished" = isFinished ? "finished" : isRunning ? "active" : "idle";
  const setupVisible = showSetupDrawer && !isRunning;
  const showBottomModeStrip = !isTextView && !isRunning;
  const showDetailedStats = isTestView || isFinished || (!isTextView && !isRunning);
  const finishedSession = lastSession;
  const charProgressLabel = `${isFinished ? finishedSession?.metrics.correctChars : liveMetrics.correctChars}/${isFinished ? finishedSession?.metrics.totalTypedChars : liveMetrics.totalTypedChars} chars`;
  const charErrorLabel = `${isFinished ? finishedSession?.metrics.errors : liveMetrics.errors} char errors`;
  const showUltraMinimal = isRunning && (isTextView || isPro);
  const viewSurfaceClass = isTextView
    ? "bg-surface/98"
    : isTestView
      ? "bg-surface/94"
      : "bg-accentSoft/18";
  const viewBadgeClass = isTextView
    ? "border-line bg-surface text-ink"
    : isTestView
      ? "border-accent bg-accent text-white"
      : "border-accent/20 bg-accentSoft text-accent";
  const coachHint =
    isFinished && recommendations[0]
      ? recommendations[0].body
      : isTextView
        ? "Read the line, settle your rhythm, and let the interface disappear."
        : isTestView
          ? "This view measures performance more strictly. Keep your pace clean and controlled."
          : "This view is for skill building. Aim for clean accuracy, then repeat with confidence.";
  const completionInsight = finishedSession
    ? getCompletionInsight(
        finishedSession.metrics.netWpm,
        finishedSession.metrics.accuracy,
        finishedSession.metrics.consistency
      )
    : "";

  useEffect(() => {
    setWindowStart(0);
  }, [prompt.id]);

  useEffect(() => {
    if (!finishedSession) {
      return;
    }
    setShowFinishToast(true);
    const timeout = window.setTimeout(() => setShowFinishToast(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [finishedSession]);

  useEffect(() => {
    setWindowStart((current) => {
      if (typedLength < current + trailingBuffer) {
        return current;
      }
      if (typedLength <= current + revealLead) {
        return current;
      }
      return findStableWindowStart(promptGraphemes, typedLength - trailingBuffer);
    });
  }, [promptGraphemes, revealLead, trailingBuffer, typedLength]);

  const switchMode = (mode: PracticeMode) => {
    settings.setMode(mode);
    restartSession();
    textareaRef.current?.focus();
  };

  const setDuration = (seconds: number) => {
    settings.setDurationSeconds(seconds);
    restartSession();
    textareaRef.current?.focus();
  };

  const setWords = (count: number) => {
    settings.setWordCount(count);
    restartSession();
    textareaRef.current?.focus();
  };

  const setLanguage = (language: LanguageCode) => {
    settings.setLanguage(language);
    restartSession();
    textareaRef.current?.focus();
  };

  const warmAudio = () => {
    if (!settings.soundEnabled) {
      return;
    }
    void warmTypeSound();
  };

  const playSound = (kind: "type" | "backspace" | "finish") => {
    if (!settings.soundEnabled) {
      return;
    }
    void playTypeSound(kind);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <section className="rounded-[2rem] border border-line bg-surface/96 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-line bg-panel/50 px-4 py-8 text-sm text-muted">
            Loading practice workspace...
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <section className="rounded-[2rem] border border-line bg-surface/96 backdrop-blur-[2px]">
        <div
          className={cn(
            "relative z-20 border-b border-line transition-all duration-150",
            isTypingActive ? "px-3 py-3 sm:px-5" : "px-4 py-4 sm:px-6 lg:px-8",
            showUltraMinimal && "border-transparent pb-2"
          )}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <HorizontalRail>
                  <div
                    className={cn(
                      "flex min-w-max items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted transition-opacity duration-150",
                      showUltraMinimal && "opacity-75"
                    )}
                    >
                    <TopChip>{progressLabel}</TopChip>
                    {cleanWordsLabel ? <TopChip>{cleanWordsLabel}</TopChip> : null}
                    {wrongWordsLabel ? <TopChip>{wrongWordsLabel}</TopChip> : null}
                    {missedWordsLabel ? <TopChip>{missedWordsLabel}</TopChip> : null}
                    <TopChip>{charProgressLabel}</TopChip>
                    <TopChip>{settings.contentDifficulty}</TopChip>
                    {isTestView || isFinished ? <TopChip>{isFinished ? finishedSession?.metrics.netWpm : liveMetrics.netWpm} wpm</TopChip> : null}
                  </div>
                </HorizontalRail>
              </div>

              <HorizontalRail>
                <div className="flex min-w-max items-center gap-2 px-1">
                  {!isRunning ? (
                    <ActionButton
                      onClick={() => {
                        setShowSetupDrawer((value) => !value);
                        textareaRef.current?.focus();
                      }}
                      active={setupVisible}
                    >
                      Setup
                      {setupVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </ActionButton>
                  ) : null}
                  <ActionButton
                    onClick={() => {
                      restartSession();
                      textareaRef.current?.focus();
                    }}
                    accent={isRunning}
                    muted={showUltraMinimal}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                  </ActionButton>
                  {isRunning ? (
                    <ActionButton onClick={() => finishSession()} muted={showUltraMinimal}>
                      Finish
                    </ActionButton>
                  ) : null}
                  <Link
                    href="/settings"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition",
                      isRunning
                        ? cn("text-ink hover:text-ink", showUltraMinimal ? "bg-panel/55 hover:bg-panel/65" : "bg-panel/70 hover:bg-panel")
                        : "bg-panel/80 text-ink hover:bg-accentSoft"
                    )}
                  >
                    <Settings2 className="h-4 w-4" />
                    Settings
                  </Link>
                </div>
              </HorizontalRail>
            </div>

            {!isRunning ? (
              <HorizontalRail>
                <div className="flex min-w-max gap-2 px-1">
                  {VIEW_MODES.map((view) => (
                    <button
                      key={view.id}
                      type="button"
                      onMouseDown={keepTypingFocus}
                      onClick={() => settings.setPracticeView(view.id)}
                      className={cn(
                        "rounded-full border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition",
                        settings.practiceView === view.id ? viewBadgeClass : "border-line bg-panel/65 text-ink hover:bg-panel hover:text-ink"
                      )}
                      title={`${view.label}: ${view.note}`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </HorizontalRail>
            ) : null}

            <motion.div
              initial={false}
              animate={{ height: setupVisible ? "auto" : 0, opacity: setupVisible ? 1 : 0, marginTop: setupVisible ? 4 : 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-[1.5rem] border border-line bg-panel/40 px-3 py-3 sm:px-4">
                <div className="space-y-3">
                  <CompactScroller label="Mode">
                    {PRIMARY_MODES.map((mode) => (
                      <MicroToggle key={mode} label={mode} active={settings.mode === mode} onClick={() => switchMode(mode)} />
                    ))}
                    {SECONDARY_MODES.map((mode) => (
                      <MicroToggle key={mode} label={mode} active={settings.mode === mode} onClick={() => switchMode(mode)} />
                    ))}
                  </CompactScroller>

                  <CompactScroller label="Difficulty">
                    {DIFFICULTY_OPTIONS.map((difficulty) => (
                      <MicroToggle
                        key={difficulty.id}
                        label={difficulty.label}
                        active={settings.contentDifficulty === difficulty.id}
                        onClick={() => settings.setContentDifficulty(difficulty.id)}
                        title={`${difficulty.label} content`}
                      />
                    ))}
                  </CompactScroller>

                  <CompactScroller label="Duration">
                    {DURATION_PRESETS.map((seconds) => (
                      <MicroToggle key={seconds} label={formatDurationLabel(seconds)} active={settings.durationSeconds === seconds} onClick={() => setDuration(seconds)} />
                    ))}
                  </CompactScroller>

                  <CompactScroller label="Words">
                    {WORD_PRESETS.map((count) => (
                      <MicroToggle key={count} label={`${count}`} active={settings.wordCount === count} onClick={() => setWords(count)} />
                    ))}
                  </CompactScroller>

                  <CompactScroller label="Language">
                    {(Object.keys(LANGUAGES) as LanguageCode[]).map((language) => (
                      <MicroToggle
                        key={language}
                        label={language}
                        active={settings.language === language}
                        onClick={() => setLanguage(language)}
                        title={`${LANGUAGES[language].label} / ${LANGUAGES[language].nativeLabel}`}
                      />
                    ))}
                    <MicroToggle
                      label={isPro ? "rich" : "pro"}
                      active={false}
                      onClick={() => settings.setPracticeLayout(isPro ? "rich" : "pro")}
                      title={isPro ? "Switch to rich layout" : "Switch to pro layout"}
                    />
                  </CompactScroller>

                  {!isPro ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">Custom minutes</span>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={Math.max(1, Math.round(settings.durationSeconds / 60))}
                          onChange={(event) => setDuration(clampCustomMinutes(Number(event.target.value)) * 60)}
                          className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-ink outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">Custom words</span>
                        <input
                          type="number"
                          min={10}
                          max={1000}
                          value={settings.wordCount}
                          onChange={(event) => setWords(Number(event.target.value))}
                          className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-ink outline-none"
                        />
                      </label>
                      {settings.mode === "custom" ? (
                        <label className="block sm:col-span-2">
                          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">Custom text</span>
                          <textarea
                            data-settings-input="true"
                            value={settings.customText}
                            onChange={(event) => settings.setCustomText(event.target.value)}
                            className="min-h-28 w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-ink outline-none"
                            placeholder="Paste exact text for custom practice."
                          />
                        </label>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      Alt + 1..7 duration, Alt + Q/W/E/A/N/P/C/Z/X mode, Alt + left/right language, Alt +/- words
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className={cn(
            "relative z-10 transition-all duration-150",
            isTypingActive ? "px-3 py-4 sm:px-5" : "px-4 py-5 sm:px-6 lg:px-8 lg:py-6"
          )}
        >
          <div className={cn("mx-auto", isPro ? "max-w-[920px]" : "max-w-[1020px]")}>
            {showDetailedStats ? (
              <HorizontalRail>
                <div
                  className={cn(
                    "mb-3 flex min-w-max items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted transition-opacity duration-150",
                    isRunning && "opacity-80",
                    showUltraMinimal && "mb-2 opacity-65"
                  )}
                >
                  <QuietStat label="net" value={`${isFinished ? finishedSession?.metrics.netWpm : liveMetrics.netWpm}`} tone={topStatTone} />
                  <QuietStat label="acc" value={`${isFinished ? finishedSession?.metrics.accuracy : liveMetrics.accuracy}%`} tone={topStatTone} />
                  <QuietStat label="progress" value={isFinished ? "done" : progressLabel} tone={topStatTone} />
                  {cleanWordsLabel ? <QuietStat label="clean" value={`${strictWordScore.cleanWords}`} tone={topStatTone} /> : null}
                  {wrongWordsLabel ? <QuietStat label="wrong" value={`${strictWordScore.wrongWords}`} tone={topStatTone} /> : null}
                  {missedWordsLabel ? <QuietStat label="remaining" value={`${strictWordScore.remainingWords}`} tone={topStatTone} /> : null}
                  <QuietStat label="chars" value={charProgressLabel} tone={topStatTone} />
                  {isTestView || isFinished ? (
                    <QuietStat label="errors" value={`${isFinished ? finishedSession?.metrics.errors : liveMetrics.errors}`} tone={topStatTone} />
                  ) : null}
                </div>
              </HorizontalRail>
            ) : null}

            {showFinishToast && finishedSession ? (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accentSoft px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent shadow-[0_12px_30px_-18px_rgba(15,118,110,0.65)]"
              >
                Session complete
                <span className="rounded-full bg-panel px-2 py-1 text-ink">{finishedSession.metrics.netWpm} wpm</span>
                <span className="rounded-full bg-panel px-2 py-1 text-ink">{finishedSession.metrics.accuracy}% acc</span>
              </motion.div>
            ) : null}

            {sessionNotice ? (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                {sessionNotice}
              </div>
            ) : null}

            <motion.div
              initial={false}
              animate={{ y: isRunning ? 0 : 2 }}
              transition={{ duration: 0.12 }}
              className={cn(
                "relative overflow-hidden rounded-[1.5rem] border border-line transition-colors duration-150",
                viewSurfaceClass,
                isPro ? "min-h-[330px] sm:min-h-[360px]" : "min-h-[370px] sm:min-h-[410px]"
              )}
              onClick={() => textareaRef.current?.focus()}
            >
              <textarea
                ref={textareaRef}
                data-practice-input="true"
                value={typedText}
                onFocus={warmAudio}
                onPointerDown={warmAudio}
                onBlur={() => {
                  if (status !== "running") {
                    return;
                  }
                  if (blurRefocusTimerRef.current) {
                    window.clearTimeout(blurRefocusTimerRef.current);
                  }
                  blurRefocusTimerRef.current = window.setTimeout(() => {
                    textareaRef.current?.focus();
                  }, 0);
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  setSessionNotice("Paste blocked during practice");
                }}
                onCopy={(event) => {
                  if (status === "running") {
                    event.preventDefault();
                    setSessionNotice("Copy blocked during practice");
                  }
                }}
                onCut={(event) => {
                  if (status === "running") {
                    event.preventDefault();
                    setSessionNotice("Cut blocked during practice");
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setSessionNotice("Drop blocked during practice");
                }}
                onChange={(event) => {
                  updateTypedText(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (status === "idle") {
                    startSession();
                  }
                  if (event.key === "Tab") {
                    event.preventDefault();
                    return;
                  }
                  warmAudio();
                  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    playSound("type");
                  }
                  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                    event.preventDefault();
                    playSound("finish");
                    finishSession();
                  }
                  if (event.key === "Backspace") {
                    playSound("backspace");
                    registerBackspace();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    restartSession();
                  }
                }}
                className="absolute inset-0 z-10 h-full w-full resize-none border-0 bg-transparent text-transparent caret-transparent outline-none"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                aria-label="Typing practice input"
              />

              <div className={cn("relative z-0", isPro ? "px-4 py-5 sm:px-6 sm:py-7" : "px-4 py-5 sm:px-6 sm:py-7")}>
                {!isRunning ? (
                  <div
                    className={cn(
                      "mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-muted transition-opacity duration-150",
                      isTypingActive && "opacity-70"
                    )}
                  >
                    <span>{currentView.label}</span>
                    <span>{currentView.note}</span>
                  </div>
                ) : windowStart > 0 ? (
                  <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">Continue from current line</div>
                ) : null}
                <div
                  className={cn(
                    "mx-auto w-full max-w-[30ch] font-medium tracking-[0.01em] text-ink",
                    isFinished ? "pointer-events-auto typezy-scrollbar-hide" : "pointer-events-none",
                    isTextView
                      ? "text-[1.5rem] leading-[1.9] sm:max-w-[34ch] sm:text-[2.35rem]"
                      : isPro
                        ? "text-[1.35rem] leading-[1.8] sm:max-w-[30ch] sm:text-[2rem]"
                        : "text-[1.45rem] leading-[1.82] sm:max-w-[32ch] sm:text-[2.2rem]"
                  )}
                  style={{
                    fontSize: `${settings.fontScale * (isTextView ? 1.48 : isPro ? 1.28 : 1.38)}rem`,
                    maxHeight: isFinished ? "15rem" : undefined,
                    overflowY: isFinished ? "auto" : undefined,
                    paddingRight: isFinished ? "0.35rem" : undefined
                  }}
                >
                  {displayedPrompt.map((char, index) => {
                    const absoluteIndex = isFinished ? index : windowStart + index;
                    const typedChar = typedGraphemes[absoluteIndex];
                    const isCurrent = absoluteIndex === typedLength;
                    const isCorrect = typedChar === char;
                    const hasTyped = typedChar !== undefined;

                    return (
                      <span
                        key={`${char}-${absoluteIndex}`}
                        className={cn(
                          "relative rounded-[0.22em] transition-colors duration-100",
                          !hasTyped && (isRunning ? "text-muted/80" : "text-muted/90"),
                          hasTyped && isCorrect && "text-ink",
                          hasTyped && !isCorrect && "bg-danger/12 text-danger",
                          isCurrent &&
                            (settings.caretStyle === "underline"
                              ? "after:absolute after:bottom-[-0.08em] after:left-0 after:h-[0.12em] after:w-full after:rounded-full after:bg-accent"
                              : settings.caretStyle === "block"
                                ? "bg-accentSoft"
                                : "after:absolute after:left-[-0.04em] after:top-[0.08em] after:h-[0.95em] after:w-[0.1em] after:rounded-full after:bg-accent")
                        )}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <div
              className={cn(
                "mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted transition-opacity duration-150",
                isRunning && "opacity-35",
                showUltraMinimal && "pointer-events-none opacity-0"
              )}
            >
              <span className={cn("rounded-full border px-3 py-1.5", viewBadgeClass)}>{currentView.label}</span>
              <span className="normal-case tracking-normal text-muted">{coachHint}</span>
            </div>

            {isFinished && finishedSession ? (
              <section className="mt-4 overflow-hidden rounded-[1.6rem] border border-accent/20 bg-gradient-to-br from-accentSoft via-surface to-surface px-4 py-4 shadow-[0_24px_60px_-32px_rgba(15,118,110,0.55)] sm:px-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Session complete</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                      {finishedSession.metrics.netWpm} net WPM with {finishedSession.metrics.accuracy}% accuracy
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {completionInsight}
                    </p>
                    <div className="mt-3 inline-flex rounded-full border border-accent/20 bg-surface/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-accent">
                      Next: {recommendations[0]?.title || "Repeat the same setup once more"}
                    </div>
                    <p className="mt-3 text-xs leading-6 text-muted">
                      Detailed result is ready now, but this summary is designed to reward the finish moment immediately.
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <ResultPill label="Gross" value={`${finishedSession.metrics.grossWpm}`} />
                    <ResultPill label="Consistency" value={`${finishedSession.metrics.consistency}%`} />
                    <ResultPill label="Errors" value={`${finishedSession.metrics.errors}`} />
                    <ResultPill label="Time" value={`${finishedSession.durationSec}s`} />
                    <ResultPill label="Correct chars" value={`${finishedSession.metrics.correctChars}`} />
                    <ResultPill label="Typed chars" value={`${finishedSession.metrics.totalTypedChars}`} />
                    <ResultPill label="Char errors" value={charErrorLabel} />
                    <ResultPill label="Wrong words" value={`${strictWordScore.wrongWords}`} />
                    <ResultPill label="Remaining words" value={`${strictWordScore.remainingWords}`} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      restartSession();
                      textareaRef.current?.focus();
                    }}
                    className="rounded-full bg-accent px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white"
                  >
                    Practice again
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/results/${finishedSession.id}`)}
                    className="rounded-full border border-line bg-panel/70 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink"
                  >
                    Open result
                  </button>
                </div>
                <div className="mt-4 rounded-[1.35rem] border border-line/80 bg-surface/72 p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Full transcript</p>
                  <div className="typezy-scrollbar-hide mt-3 max-h-44 overflow-y-auto rounded-[1rem] bg-panel/35 p-3 text-sm leading-7 text-ink">
                    {promptGraphemes.map((char, index) => {
                      const typedChar = typedGraphemes[index];
                      const hasTyped = typedChar !== undefined;
                      const isCorrect = typedChar === char;

                      return (
                        <span
                          key={`transcript-${char}-${index}`}
                          className={cn(
                            !hasTyped && "text-muted/70",
                            hasTyped && isCorrect && "text-ink",
                            hasTyped && !isCorrect && "bg-danger/12 text-danger"
                          )}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </section>
            ) : null}

            {showBottomModeStrip ? (
              <div className={cn("mt-3 space-y-2 text-[11px] uppercase tracking-[0.18em] text-muted", isRunning && "opacity-75")}>
                <HorizontalRail>
                  <div className="flex min-w-max gap-2 px-1">
                    {PRIMARY_MODES.map((mode) => (
                      <MicroToggle key={mode} label={mode} active={settings.mode === mode} onClick={() => switchMode(mode)} />
                    ))}
                  </div>
                </HorizontalRail>
                <HorizontalRail>
                  <div className="flex min-w-max items-center gap-2 px-1">
                    <TopChip>{LANGUAGES[settings.language].label}</TopChip>
                    <TopChip>{durationLabel}</TopChip>
                    <TopChip>{settings.wordCount} words</TopChip>
                    {!isPro ? (
                      <Link href="/results" className="typezy-pill-surface px-3 py-1.5 hover:bg-panel">
                        Last result
                      </Link>
                    ) : null}
                  </div>
                </HorizontalRail>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function TopChip({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-line/70 bg-panel/60 px-3 py-1.5 text-ink">{children}</span>;
}

function ActionButton({
  children,
  onClick,
  active = false,
  accent = false,
  muted = false,
  preserveFocus = true
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  accent?: boolean;
  muted?: boolean;
  preserveFocus?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={preserveFocus ? keepTypingFocus : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition",
        accent && "border-accent bg-accent text-white",
        active && !accent && "border-line bg-panel/80 text-ink",
        muted && !accent && !active && "border-line bg-panel/50 text-ink hover:bg-panel/60 hover:text-ink",
        !muted && !accent && !active && "border-line bg-panel/65 text-ink hover:bg-accentSoft"
      )}
    >
      {children}
    </button>
  );
}

function CompactScroller({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="min-w-20 text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <HorizontalRail>
        <div className="flex min-w-max gap-2 px-1">{children}</div>
      </HorizontalRail>
    </div>
  );
}

function HorizontalRail({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative max-w-full overflow-x-auto typezy-scrollbar-hide">
      {children}
    </div>
  );
}

function MicroToggle({
  label,
  active,
  onClick,
  title
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={keepTypingFocus}
      onClick={onClick}
      title={title}
      aria-label={title || label}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition",
        active ? "border-accent bg-accent text-white" : "border-line/70 bg-panel/60 text-ink hover:bg-accentSoft hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}

function QuietStat({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "idle" | "active" | "finished";
}) {
  return (
    <div
      className={cn(
        "rounded-full border px-3 py-1.5 transition",
        tone === "idle" && "border-line bg-panel/60 text-ink",
        tone === "active" && "border-line bg-panel/52 text-ink",
        tone === "finished" && "border-accent/20 bg-accentSoft text-accent"
      )}
    >
      {label} {value}
    </div>
  );
}

function ResultPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-panel/65 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
