import { deAdvanced, deBeginner, deIntermediate } from "@/data/content/de";
import { enAdvanced, enBeginner, enIntermediate } from "@/data/content/en";
import { esAdvanced, esBeginner, esIntermediate } from "@/data/content/es";
import { frAdvanced, frBeginner, frIntermediate } from "@/data/content/fr";
import { hiAdvanced, hiBeginner, hiIntermediate } from "@/data/content/hi";
import { ContentDifficulty, LanguageCode, LanguageContentLibrary } from "@/lib/types";

function flattenWords(library: LanguageContentLibrary) {
  return (Object.keys(library) as ContentDifficulty[]).flatMap((difficulty) => library[difficulty].words);
}

function flattenQuotes(library: LanguageContentLibrary) {
  return (Object.keys(library) as ContentDifficulty[]).flatMap((difficulty) => library[difficulty].quotes);
}

function flattenSentences(library: LanguageContentLibrary) {
  return (Object.keys(library) as ContentDifficulty[]).flatMap((difficulty) => library[difficulty].sentences);
}

export const CONTENT_LIBRARY: Record<LanguageCode, LanguageContentLibrary> = {
  en: {
    beginner: enBeginner,
    intermediate: enIntermediate,
    advanced: enAdvanced
  },
  hi: {
    beginner: hiBeginner,
    intermediate: hiIntermediate,
    advanced: hiAdvanced
  },
  es: {
    beginner: esBeginner,
    intermediate: esIntermediate,
    advanced: esAdvanced
  },
  fr: {
    beginner: frBeginner,
    intermediate: frIntermediate,
    advanced: frAdvanced
  },
  de: {
    beginner: deBeginner,
    intermediate: deIntermediate,
    advanced: deAdvanced
  }
};

export const CONTENT_OVERVIEW = {
  allWords: {
    en: flattenWords(CONTENT_LIBRARY.en),
    hi: flattenWords(CONTENT_LIBRARY.hi),
    es: flattenWords(CONTENT_LIBRARY.es),
    fr: flattenWords(CONTENT_LIBRARY.fr),
    de: flattenWords(CONTENT_LIBRARY.de)
  },
  allQuotes: {
    en: flattenQuotes(CONTENT_LIBRARY.en),
    hi: flattenQuotes(CONTENT_LIBRARY.hi),
    es: flattenQuotes(CONTENT_LIBRARY.es),
    fr: flattenQuotes(CONTENT_LIBRARY.fr),
    de: flattenQuotes(CONTENT_LIBRARY.de)
  },
  allSentences: {
    en: flattenSentences(CONTENT_LIBRARY.en),
    hi: flattenSentences(CONTENT_LIBRARY.hi),
    es: flattenSentences(CONTENT_LIBRARY.es),
    fr: flattenSentences(CONTENT_LIBRARY.fr),
    de: flattenSentences(CONTENT_LIBRARY.de)
  }
};
