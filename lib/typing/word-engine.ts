function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export type WordStatus = "pending" | "active" | "clean" | "wrong" | "remaining";

export type WordTokenState = {
  index: number;
  target: string;
  typed: string;
  status: WordStatus;
  correctCharCount: number;
  incorrectCharCount: number;
  extraCharCount: number;
  missedCharCount: number;
  wasCorrected: boolean;
  finalizedAt: number | null;
};

export type WordEngineSummary = {
  totalWords: number;
  attemptedWords: number;
  completedWords: number;
  cleanWords: number;
  wrongWords: number;
  remainingWords: number;
  activeIndex: number;
  exactMatch: boolean;
  targetWords: string[];
  typedWords: string[];
  tokens: WordTokenState[];
};

type WordEngineOptions = {
  finalizeActiveToken?: boolean;
};

export type TypingEngineMode = "time" | "words" | "quote" | "custom" | "zen" | "code" | "adaptive";

export type TypingEngineState = {
  mode: TypingEngineMode;
  targetText: string;
  desiredWordCount: number;
  typedText: string;
  started: boolean;
  finished: boolean;
  endedBy: "timer" | "target" | "manual" | null;
  summary: WordEngineSummary;
};

function buildTokenState(index: number, target: string, typed: string, status: WordStatus, finalizedAt: number | null): WordTokenState {
  const targetChars = Array.from(target);
  const typedChars = Array.from(typed);
  const longest = Math.max(targetChars.length, typedChars.length);
  let correctCharCount = 0;
  let incorrectCharCount = 0;
  let extraCharCount = 0;
  let missedCharCount = 0;

  for (let charIndex = 0; charIndex < longest; charIndex += 1) {
    const expected = targetChars[charIndex];
    const actual = typedChars[charIndex];

    if (expected === undefined && actual !== undefined) {
      incorrectCharCount += 1;
      extraCharCount += 1;
      continue;
    }

    if (expected !== undefined && actual === undefined) {
      missedCharCount += 1;
      continue;
    }

    if (expected === actual) {
      correctCharCount += 1;
    } else {
      incorrectCharCount += 1;
    }
  }

  return {
    index,
    target,
    typed,
    status,
    correctCharCount,
    incorrectCharCount,
    extraCharCount,
    missedCharCount,
    wasCorrected: false,
    finalizedAt
  };
}

export function deriveWordEngineState(
  typedText: string,
  targetText: string,
  desiredWordCount: number,
  options: WordEngineOptions = {}
): WordEngineSummary {
  const targetWords = splitWords(targetText);
  const totalWords = Math.min(Math.max(desiredWordCount, 0), targetWords.length);
  const limitedTargetWords = targetWords.slice(0, totalWords);
  const typedWords = splitWords(typedText);
  const exactMatch = typedText.trim() === limitedTargetWords.join(" ");
  const hasAnyTypedText = typedText.trim().length > 0;
  const finalWordIsClosed = /\s$/.test(typedText) || exactMatch;
  const baseCompletedWords = Math.max(0, typedWords.length - (!finalWordIsClosed && hasAnyTypedText ? 1 : 0));
  const rawActiveIndex = !finalWordIsClosed && hasAnyTypedText ? baseCompletedWords : -1;
  const activeIndex = rawActiveIndex >= 0 && rawActiveIndex < totalWords ? rawActiveIndex : -1;
  const activeTypedWord = activeIndex >= 0 ? typedWords[activeIndex] || "" : "";
  const finalWordExact =
    activeIndex === totalWords - 1 &&
    totalWords > 0 &&
    activeTypedWord === limitedTargetWords[activeIndex];
  const shouldFinalizeActiveToken = activeIndex >= 0 && (options.finalizeActiveToken || finalWordExact);
  const completedWords = Math.min(baseCompletedWords + (shouldFinalizeActiveToken ? 1 : 0), totalWords);

  const tokens: WordTokenState[] = [];
  let cleanWords = 0;
  let wrongWords = 0;

  for (let index = 0; index < totalWords; index += 1) {
    const target = limitedTargetWords[index];
    const typed = typedWords[index] || "";

    if (index < completedWords) {
      const status: WordStatus = typed === target ? "clean" : "wrong";
      if (status === "clean") {
        cleanWords += 1;
      } else {
        wrongWords += 1;
      }
      tokens.push(buildTokenState(index, target, typed, status, index + 1));
      continue;
    }

    if (index === activeIndex && !shouldFinalizeActiveToken) {
      tokens.push(buildTokenState(index, target, typed, "active", null));
      continue;
    }

    tokens.push(buildTokenState(index, target, "", "remaining", null));
  }

  return {
    totalWords,
    attemptedWords: completedWords,
    completedWords,
    cleanWords,
    wrongWords,
    remainingWords: Math.max(0, totalWords - completedWords),
    activeIndex,
    exactMatch,
    targetWords: limitedTargetWords,
    typedWords,
    tokens
  };
}

export function recomputeDerivedMetrics(state: TypingEngineState, options: WordEngineOptions = {}) {
  return {
    ...state,
    summary: deriveWordEngineState(state.typedText, state.targetText, state.desiredWordCount, options)
  };
}

export function handlePrintableKey(state: TypingEngineState, key: string) {
  if (state.finished || key.length !== 1) {
    return state;
  }

  return recomputeDerivedMetrics({
    ...state,
    started: true,
    typedText: `${state.typedText}${key}`
  });
}

export function handleBackspace(state: TypingEngineState) {
  if (state.finished || state.typedText.length === 0) {
    return state;
  }

  return recomputeDerivedMetrics({
    ...state,
    typedText: state.typedText.slice(0, -1)
  });
}

export function finalizeToken(state: TypingEngineState) {
  return recomputeDerivedMetrics(state, { finalizeActiveToken: true });
}

export function finishTest(state: TypingEngineState, endedBy: TypingEngineState["endedBy"]) {
  const finalized = recomputeDerivedMetrics(
    {
      ...state,
      finished: true,
      endedBy
    },
    { finalizeActiveToken: true }
  );

  return {
    ...finalized,
    summary: {
      ...finalized.summary,
      completedWords: finalized.summary.cleanWords + finalized.summary.wrongWords,
      attemptedWords: finalized.summary.cleanWords + finalized.summary.wrongWords,
      remainingWords: Math.max(0, finalized.summary.totalWords - finalized.summary.cleanWords - finalized.summary.wrongWords)
    }
  };
}

export type WordProgress = {
  targetWords: string[];
  typedWords: string[];
  completedTypedWords: number;
  completedCorrectWords: number;
  completedIncorrectWords: number;
  missedTargetWords: number;
  exactMatch: boolean;
  words: WordTokenState[];
};

export function analyzeWordProgress(typedText: string, targetText: string): WordProgress {
  const allTargetWords = splitWords(targetText);
  const summary = deriveWordEngineState(typedText, targetText, allTargetWords.length);
  return {
    targetWords: summary.targetWords,
    typedWords: summary.typedWords,
    completedTypedWords: summary.completedWords,
    completedCorrectWords: summary.cleanWords,
    completedIncorrectWords: summary.wrongWords,
    missedTargetWords: 0,
    exactMatch: summary.exactMatch,
    words: summary.tokens
  };
}

export function getCompletedWordCount(typedText: string, targetText: string) {
  return analyzeWordProgress(typedText, targetText).completedCorrectWords;
}

export function getTypedCompletedWordCount(typedText: string, targetText: string) {
  return analyzeWordProgress(typedText, targetText).completedTypedWords;
}

export function getStrictTargetWordScore(
  typedText: string,
  targetText: string,
  desiredWordCount: number,
  options: WordEngineOptions = {}
) {
  return deriveWordEngineState(typedText, targetText, desiredWordCount, options);
}

export function hasCompletedWordTarget(typedText: string, targetText: string, desiredWordCount: number) {
  const summary = deriveWordEngineState(typedText, targetText, desiredWordCount);
  return summary.completedWords >= summary.totalWords && summary.totalWords > 0;
}
