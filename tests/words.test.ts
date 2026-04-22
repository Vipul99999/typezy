import { describe, expect, it } from "vitest";
import {
  analyzeWordProgress,
  getCompletedWordCount,
  getStrictTargetWordScore,
  getTypedCompletedWordCount,
  hasCompletedWordTarget
} from "@/lib/typing/word-engine";

describe("word progress helpers", () => {
  it("does not count the current partial word as completed or correct", () => {
    expect(getCompletedWordCount("focus rhythm cla", "focus rhythm clarity")).toBe(2);
    expect(getTypedCompletedWordCount("focus rhythm cla", "focus rhythm clarity")).toBe(2);
  });

  it("counts the final word when the full target is reached without trailing space", () => {
    expect(getCompletedWordCount("focus rhythm clarity", "focus rhythm clarity")).toBe(3);
    expect(getTypedCompletedWordCount("focus rhythm clarity", "focus rhythm clarity")).toBe(3);
  });

  it("does not treat a partially-correct but wrong word as a correct word", () => {
    expect(getCompletedWordCount("focus rhytm ", "focus rhythm clarity")).toBe(1);
    expect(getTypedCompletedWordCount("focus rhytm ", "focus rhythm clarity")).toBe(2);
  });

  it("does not overcount multiple wrong words that share some correct letters", () => {
    const progress = analyzeWordProgress("focus rhythm claritty ", "focus rhythm clarity control");
    expect(progress.completedCorrectWords).toBe(2);
    expect(progress.completedIncorrectWords).toBe(1);
    expect(progress.completedTypedWords).toBe(3);
  });

  it("only counts words as correct when each finished word fully matches", () => {
    const progress = analyzeWordProgress("focus rhytm claritty ", "focus rhythm clarity control");
    expect(progress.completedCorrectWords).toBe(1);
    expect(progress.completedIncorrectWords).toBe(2);
    expect(progress.completedTypedWords).toBe(3);
  });

  it("resynchronizes after a wrong word so later correct words still count", () => {
    const progress = analyzeWordProgress("focus rhythm wrng control calm ", "focus rhythm wrong control calm");
    expect(progress.completedCorrectWords).toBe(4);
    expect(progress.completedIncorrectWords).toBe(1);
    expect(progress.completedTypedWords).toBe(5);
  });

  it("treats an extra typed word as consuming a wrong finalized slot in strict word mode", () => {
    const progress = analyzeWordProgress("focus extra rhythm clarity control ", "focus rhythm clarity control");
    expect(progress.completedCorrectWords).toBe(1);
    expect(progress.completedIncorrectWords).toBe(3);
    expect(progress.completedTypedWords).toBe(4);
  });

  it("counts later correct words after an earlier substitution when slot order is preserved", () => {
    const progress = analyzeWordProgress("alpha bravo oops delta echo ", "alpha bravo charlie delta echo");
    expect(progress.completedCorrectWords).toBe(4);
    expect(progress.completedIncorrectWords).toBe(1);
    expect(progress.missedTargetWords).toBe(0);
  });

  it("treats skipped target words as wrong finalized slots in strict word mode", () => {
    const progress = analyzeWordProgress("alpha charlie delta echo ", "alpha bravo charlie delta echo");
    expect(progress.completedCorrectWords).toBe(1);
    expect(progress.completedIncorrectWords).toBe(3);
    expect(progress.missedTargetWords).toBe(0);
  });

  it("only marks the word target complete when the desired number of words has actually been typed", () => {
    expect(hasCompletedWordTarget("focus rhythm cla", "focus rhythm clarity", 3)).toBe(false);
    expect(hasCompletedWordTarget("focus rhytm ", "focus rhythm clarity", 3)).toBe(false);
    expect(hasCompletedWordTarget("focus rhytm clarity ", "focus rhythm clarity", 3)).toBe(true);
    expect(hasCompletedWordTarget("focus rhythm clarity", "focus rhythm clarity", 3)).toBe(true);
  });

  it("uses strict slot scoring for visible clean and wrong counters", () => {
    const score = getStrictTargetWordScore("focus extra rhythm clarity control ", "focus rhythm clarity control", 25);
    expect(score.attemptedWords).toBe(4);
    expect(score.cleanWords).toBe(1);
    expect(score.wrongWords).toBe(3);
    expect(score.remainingWords).toBe(0);
  });

  it("keeps strict visible counters internally consistent", () => {
    const score = getStrictTargetWordScore("alpha bravo wrong delta ", "alpha bravo charlie delta echo", 5);
    expect(score.cleanWords + score.wrongWords).toBe(score.attemptedWords);
    expect(score.attemptedWords + score.remainingWords).toBe(5);
  });

  it("finalizes a partial current word as wrong on session end", () => {
    const liveScore = getStrictTargetWordScore("alpha bravo char", "alpha bravo charlie delta", 4);
    const finalScore = getStrictTargetWordScore("alpha bravo char", "alpha bravo charlie delta", 4, {
      finalizeActiveToken: true
    });

    expect(liveScore.attemptedWords).toBe(2);
    expect(liveScore.cleanWords).toBe(2);
    expect(liveScore.wrongWords).toBe(0);
    expect(liveScore.remainingWords).toBe(2);

    expect(finalScore.attemptedWords).toBe(3);
    expect(finalScore.cleanWords).toBe(2);
    expect(finalScore.wrongWords).toBe(1);
    expect(finalScore.remainingWords).toBe(1);
  });
});
