function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export type WordStatus = "pending" | "active" | "clean" | "wrong" | "remaining";

export type WordState = {
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

export type WordProgress = {
  targetWords: string[];
  typedWords: string[];
  completedTypedWords: number;
  completedCorrectWords: number;
  completedIncorrectWords: number;
  missedTargetWords: number;
  exactMatch: boolean;
  words: WordState[];
};

type StrictWordScoreOptions = {
  finalizePartialWord?: boolean;
};

function compareWord(target: string, typed: string) {
  const targetChars = Array.from(target);
  const typedChars = Array.from(typed);
  const longest = Math.max(targetChars.length, typedChars.length);
  let correctCharCount = 0;
  let incorrectCharCount = 0;
  let extraCharCount = 0;
  let missedCharCount = 0;

  for (let index = 0; index < longest; index += 1) {
    const expected = targetChars[index];
    const actual = typedChars[index];

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
    correctCharCount,
    incorrectCharCount,
    extraCharCount,
    missedCharCount,
    isClean: typed === target
  };
}

function buildWordState(target: string, typed: string, status: WordStatus, finalizedAt: number | null): WordState {
  const comparison = compareWord(target, typed);
  return {
    target,
    typed,
    status,
    correctCharCount: comparison.correctCharCount,
    incorrectCharCount: comparison.incorrectCharCount,
    extraCharCount: comparison.extraCharCount,
    missedCharCount: comparison.missedCharCount,
    wasCorrected: false,
    finalizedAt
  };
}

export function getStrictTargetWordScore(
  typedText: string,
  targetText: string,
  desiredWordCount: number,
  options: StrictWordScoreOptions = {}
) {
  const targetWords = splitWords(targetText);
  const totalWords = Math.min(desiredWordCount, targetWords.length);
  const typedWords = splitWords(typedText);
  const exactMatch = typedText.trim() === targetText.trim();
  const finalWordIsClosed = /\s$/.test(typedText) || exactMatch;
  const baseFinalizedWords = Math.max(0, typedWords.length - (finalWordIsClosed ? 0 : 1));
  const activeWordIndex = finalWordIsClosed ? -1 : typedWords.length - 1;
  const activeWord = activeWordIndex >= 0 ? typedWords[activeWordIndex] : "";
  const shouldFinalizeActiveWord =
    activeWordIndex >= 0 &&
    activeWordIndex < totalWords &&
    (options.finalizePartialWord || activeWord === targetWords[activeWordIndex]);
  const finalizedWords = Math.min(baseFinalizedWords + (shouldFinalizeActiveWord ? 1 : 0), totalWords);

  const words: WordState[] = [];
  let cleanWords = 0;
  let wrongWords = 0;

  for (let index = 0; index < totalWords; index += 1) {
    const target = targetWords[index];
    const typed = typedWords[index] || "";

    if (index < finalizedWords) {
      const comparison = compareWord(target, typed);
      const status: WordStatus = comparison.isClean ? "clean" : "wrong";
      if (status === "clean") {
        cleanWords += 1;
      } else {
        wrongWords += 1;
      }
      words.push(buildWordState(target, typed, status, index + 1));
      continue;
    }

    if (!shouldFinalizeActiveWord && index === activeWordIndex && index < totalWords) {
      words.push(buildWordState(target, typed, "active", null));
      continue;
    }

    words.push(buildWordState(target, "", index < typedWords.length ? "pending" : "remaining", null));
  }

  return {
    totalWords,
    attemptedWords: finalizedWords,
    cleanWords,
    wrongWords,
    remainingWords: Math.max(0, totalWords - finalizedWords),
    finalizedPartialWord: shouldFinalizeActiveWord && activeWord !== targetWords[activeWordIndex],
    words
  };
}

export function analyzeWordProgress(typedText: string, targetText: string): WordProgress {
  const targetWords = splitWords(targetText);
  const score = getStrictTargetWordScore(typedText, targetText, targetWords.length);
  return {
    targetWords,
    typedWords: splitWords(typedText),
    completedTypedWords: score.attemptedWords,
    completedCorrectWords: score.cleanWords,
    completedIncorrectWords: score.wrongWords,
    missedTargetWords: 0,
    exactMatch: typedText.trim() === targetText.trim(),
    words: score.words
  };
}

export function getCompletedWordCount(typedText: string, targetText: string) {
  return analyzeWordProgress(typedText, targetText).completedCorrectWords;
}

export function getTypedCompletedWordCount(typedText: string, targetText: string) {
  return analyzeWordProgress(typedText, targetText).completedTypedWords;
}

export function hasCompletedWordTarget(typedText: string, targetText: string, desiredWordCount: number) {
  const score = getStrictTargetWordScore(typedText, targetText, desiredWordCount);
  return score.attemptedWords >= score.totalWords;
}
