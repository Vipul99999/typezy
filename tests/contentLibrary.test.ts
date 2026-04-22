import { describe, expect, it } from "vitest";
import { CONTENT_LIBRARY, CONTENT_OVERVIEW } from "@/lib/content/content-library";

describe("content library", () => {
  it("provides starter packs for every language and difficulty", () => {
    Object.values(CONTENT_LIBRARY).forEach((library) => {
      Object.values(library).forEach((pack) => {
        expect(pack.words.length).toBeGreaterThanOrEqual(20);
        expect(pack.sentences.length).toBeGreaterThan(5);
        expect(pack.quotes.length).toBeGreaterThan(3);
        expect(pack.punctuation.length).toBeGreaterThan(3);
        expect(pack.numbers.length).toBeGreaterThan(2);
        expect(pack.code.length).toBeGreaterThan(2);
      });
    });
  });

  it("builds non-empty overview pools for every language", () => {
    Object.values(CONTENT_OVERVIEW.allWords).forEach((items) => {
      expect(items.length).toBeGreaterThan(60);
    });
    Object.values(CONTENT_OVERVIEW.allSentences).forEach((items) => {
      expect(items.length).toBeGreaterThan(20);
    });
    Object.values(CONTENT_OVERVIEW.allQuotes).forEach((items) => {
      expect(items.length).toBeGreaterThan(10);
    });
  });
});
