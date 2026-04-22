import { buildAdaptiveSequence } from "@/lib/content/adaptive";
import { CONTENT_LIBRARY, CONTENT_OVERVIEW } from "@/lib/content/content-library";
import {
  ContentDifficulty,
  DifficultyContentPack,
  LanguageCode,
  LanguageConfig,
  LanguageContentLibrary,
  PracticeMode,
  PracticePrompt,
  WeakMap
} from "@/lib/types";

type LocalizedFaq = Array<{ question: string; answer: string }>;

function hashSeed(input: string) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickDeterministicItem<T>(items: T[], seedKey: string) {
  return items[hashSeed(seedKey) % items.length];
}

function buildRandomWordSequence(words: string[], count: number, seedKey: string) {
  let seed = hashSeed(seedKey);
  let previous = "";
  const output: string[] = [];

  for (let index = 0; index < count; index += 1) {
    seed = Math.imul(seed ^ (index + 1), 1664525) + 1013904223;
    const candidateIndex = Math.abs(seed >>> 0) % words.length;
    let nextWord = words[candidateIndex];

    if (nextWord === previous) {
      nextWord = words[(candidateIndex + 1 + Math.abs(seed % 7)) % words.length];
    }

    output.push(nextWord);
    previous = nextWord;
  }

  return output.join(" ");
}

function buildSentenceSequence(sentences: string[], desiredWords: number, seedKey: string) {
  let output = "";
  let totalWords = 0;
  let index = 0;

  while (totalWords < desiredWords) {
    const sentence = pickDeterministicItem(sentences, `${seedKey}-${index}`);
    output = output ? `${output} ${sentence}` : sentence;
    totalWords = output.trim().split(/\s+/).filter(Boolean).length;
    index += 1;
  }

  return output
    .trim()
    .split(/\s+/)
    .slice(0, desiredWords)
    .join(" ");
}

function mergeUnique(...groups: string[][]) {
  return Array.from(new Set(groups.flat().filter(Boolean)));
}

function difficultyLabel(difficulty: ContentDifficulty) {
  if (difficulty === "beginner") return "Beginner";
  if (difficulty === "advanced") return "Advanced";
  return "Intermediate";
}

function getDifficultyFallbackOrder(difficulty: ContentDifficulty) {
  if (difficulty === "beginner") return ["beginner", "intermediate", "advanced"] as const;
  if (difficulty === "advanced") return ["advanced", "intermediate", "beginner"] as const;
  return ["intermediate", "beginner", "advanced"] as const;
}

function getDifficultyContent(library: LanguageContentLibrary, difficulty: ContentDifficulty): DifficultyContentPack {
  const [primary, secondary, tertiary] = getDifficultyFallbackOrder(difficulty);
  const primaryPack = library[primary];
  const secondaryPack = library[secondary];
  const tertiaryPack = library[tertiary];

  const pickPack = (key: keyof DifficultyContentPack) => {
    if (primaryPack[key].length > 0) {
      return primaryPack[key];
    }
    if (secondaryPack[key].length > 0) {
      return secondaryPack[key];
    }
    return tertiaryPack[key];
  };

  return {
    words: pickPack("words"),
    sentences: pickPack("sentences"),
    quotes: pickPack("quotes"),
    punctuation: pickPack("punctuation"),
    numbers: pickPack("numbers"),
    code: pickPack("code")
  };
}

const ENGLISH_FAQ: LocalizedFaq = [
  {
    question: "What makes the English pack useful?",
    answer: "It combines curated beginner through advanced material so speed work, realistic reading flow, and long-form accuracy can grow together."
  },
  {
    question: "Is the English typing test beginner-friendly?",
    answer: "Yes. You can start with calmer sentence packs, then move into longer quotes, punctuation, code, and advanced timed flow."
  }
];

const HINDI_FAQ: LocalizedFaq = [
  {
    question: "Does Typezy support Hindi typing fairly?",
    answer: "Yes. The comparison layer segments text by graphemes instead of naive character splitting, which is important for Devanagari rendering and scoring."
  },
  {
    question: "Is Hindi content deeper now?",
    answer: "Yes. Hindi now has structured beginner, intermediate, and advanced packs for words, sentences, quotes, punctuation, and code-style drills."
  }
];

const SPANISH_FAQ: LocalizedFaq = [
  {
    question: "What modes work well in Spanish?",
    answer: "Words, quote flow, punctuation practice, and timed sentence drills all benefit from the deeper Spanish content library."
  },
  {
    question: "Does Typezy track weak words in Spanish too?",
    answer: "Yes. Weak-word and weak-key analytics remain language-aware and are saved locally."
  }
];

const FRENCH_FAQ: LocalizedFaq = [
  {
    question: "Why include French at launch?",
    answer: "It expands the multilingual footprint while still letting Typezy support polished, difficulty-based Latin-script practice."
  },
  {
    question: "Can I use French for quick daily practice?",
    answer: "Yes. Short timed drills, sentence packs, and quotes are all designed to feel lightweight and repeatable."
  }
];

const GERMAN_FAQ: LocalizedFaq = [
  {
    question: "Is German practice mostly for speed?",
    answer: "It works for both speed and consistency because the pack now spans basic rhythm drills through longer advanced passages."
  },
  {
    question: "Does adaptive mode work in German too?",
    answer: "Yes. Adaptive prompts are generated from your weak-key history while using the language's broader content pool."
  }
];

export const LANGUAGES: Record<
  LanguageCode,
  LanguageConfig & {
    label: string;
    nativeLabel: string;
    content: LanguageContentLibrary;
    sampleWords: string[];
    sampleQuotes: string[];
    sampleCode: string[];
    sampleSentences: string[];
    seoIntro: string;
    faq: LocalizedFaq;
  }
> = {
  en: {
    id: "en",
    label: "English",
    name: "English",
    nativeLabel: "English",
    nativeName: "English",
    script: "latin",
    direction: "ltr",
    locale: "en-US",
    defaultFontClass: "font-body",
    supportsQuotes: true,
    supportsCodeMode: true,
    supportsNumbersMode: true,
    supportsPunctuationMode: true,
    wordSourceVersion: "v3",
    keyboardNotes: "Ideal for QWERTY layouts, daily productivity, and long-form typing practice.",
    content: CONTENT_LIBRARY.en,
    sampleWords: CONTENT_OVERVIEW.allWords.en,
    sampleQuotes: CONTENT_OVERVIEW.allQuotes.en,
    sampleCode: CONTENT_LIBRARY.en.intermediate.code,
    sampleSentences: CONTENT_OVERVIEW.allSentences.en,
    seoIntro: "English is the flagship launch language for Typezy, with curated content that scales from early rhythm building to advanced performance practice.",
    faq: ENGLISH_FAQ
  },
  hi: {
    id: "hi",
    label: "Hindi",
    name: "Hindi",
    nativeLabel: "हिन्दी",
    nativeName: "हिन्दी",
    script: "devanagari",
    direction: "ltr",
    locale: "hi-IN",
    defaultFontClass: "font-body",
    supportsQuotes: true,
    supportsCodeMode: true,
    supportsNumbersMode: true,
    supportsPunctuationMode: true,
    wordSourceVersion: "v3",
    keyboardNotes: "Built for copy typing with grapheme-aware comparison so combined Devanagari characters are treated more fairly.",
    content: CONTENT_LIBRARY.hi,
    sampleWords: CONTENT_OVERVIEW.allWords.hi,
    sampleQuotes: CONTENT_OVERVIEW.allQuotes.hi,
    sampleCode: CONTENT_LIBRARY.hi.intermediate.code,
    sampleSentences: CONTENT_OVERVIEW.allSentences.hi,
    seoIntro: "Hindi is a strategic Typezy launch language with grapheme-aware scoring and deeper Devanagari practice material across difficulty levels.",
    faq: HINDI_FAQ
  },
  es: {
    id: "es",
    label: "Spanish",
    name: "Spanish",
    nativeLabel: "Español",
    nativeName: "Español",
    script: "latin",
    direction: "ltr",
    locale: "es-ES",
    defaultFontClass: "font-body",
    supportsQuotes: true,
    supportsCodeMode: true,
    supportsNumbersMode: true,
    supportsPunctuationMode: true,
    wordSourceVersion: "v3",
    keyboardNotes: "Useful for broad international reach with realistic Latin-script vocabulary and sentence flow.",
    content: CONTENT_LIBRARY.es,
    sampleWords: CONTENT_OVERVIEW.allWords.es,
    sampleQuotes: CONTENT_OVERVIEW.allQuotes.es,
    sampleCode: CONTENT_LIBRARY.es.intermediate.code,
    sampleSentences: CONTENT_OVERVIEW.allSentences.es,
    seoIntro: "Spanish gives Typezy global reach with richer content for learners, professionals, and multilingual typists.",
    faq: SPANISH_FAQ
  },
  fr: {
    id: "fr",
    label: "French",
    name: "French",
    nativeLabel: "Français",
    nativeName: "Français",
    script: "latin",
    direction: "ltr",
    locale: "fr-FR",
    defaultFontClass: "font-body",
    supportsQuotes: true,
    supportsCodeMode: true,
    supportsNumbersMode: true,
    supportsPunctuationMode: true,
    wordSourceVersion: "v3",
    keyboardNotes: "Designed for polished practice sessions with readable text progression and accuracy-focused drills.",
    content: CONTENT_LIBRARY.fr,
    sampleWords: CONTENT_OVERVIEW.allWords.fr,
    sampleQuotes: CONTENT_OVERVIEW.allQuotes.fr,
    sampleCode: CONTENT_LIBRARY.fr.intermediate.code,
    sampleSentences: CONTENT_OVERVIEW.allSentences.fr,
    seoIntro: "French rounds out the Latin-script launch with more editorially varied content for education and everyday productivity.",
    faq: FRENCH_FAQ
  },
  de: {
    id: "de",
    label: "German",
    name: "German",
    nativeLabel: "Deutsch",
    nativeName: "Deutsch",
    script: "latin",
    direction: "ltr",
    locale: "de-DE",
    defaultFontClass: "font-body",
    supportsQuotes: true,
    supportsCodeMode: true,
    supportsNumbersMode: true,
    supportsPunctuationMode: true,
    wordSourceVersion: "v3",
    keyboardNotes: "German supports steadier long-form rhythm work and stronger sentence-based endurance practice.",
    content: CONTENT_LIBRARY.de,
    sampleWords: CONTENT_OVERVIEW.allWords.de,
    sampleQuotes: CONTENT_OVERVIEW.allQuotes.de,
    sampleCode: CONTENT_LIBRARY.de.intermediate.code,
    sampleSentences: CONTENT_OVERVIEW.allSentences.de,
    seoIntro: "German gives Typezy a stronger European audience with structured content that rewards both steadiness and clean accuracy.",
    faq: GERMAN_FAQ
  }
};

export function buildPrompt(
  language: LanguageCode,
  mode: PracticeMode,
  customText?: string,
  weakKeys?: WeakMap,
  weakWords?: WeakMap,
  desiredWordCount = 35,
  desiredDurationSeconds = 60,
  practiceView: "text" | "test" | "practice" = "practice",
  difficulty: ContentDifficulty = "intermediate"
): PracticePrompt {
  const pack = LANGUAGES[language];
  const difficultyPack = getDifficultyContent(pack.content, difficulty);
  const id = `${language}-${mode}-${difficulty}-${Date.now()}`;
  const normalizedWordCount = Math.min(Math.max(desiredWordCount, 10), 1000);
  const durationMinutes = Math.max(desiredDurationSeconds, 15) / 60;
  const generatedWordCount = Math.min(Math.max(normalizedWordCount, Math.ceil(durationMinutes * 180)), 10000);
  const buildWordSequence = (count: number) => buildRandomWordSequence(difficultyPack.words, count, `${id}-words-${count}`);
  const difficultyTag = difficultyLabel(difficulty);

  if (mode === "custom") {
    return {
      id,
      language,
      mode,
      source: "Custom text",
      text: customText?.trim() || "Paste custom text in settings to practice your own content."
    };
  }

  if (mode === "quote") {
    const text =
      practiceView === "text"
        ? pickDeterministicItem(difficultyPack.sentences, `${id}-text-quote`)
        : pickDeterministicItem(difficultyPack.quotes, `${id}-quote`);
    return { id, language, mode, source: `${difficultyTag} ${pack.label} quotes`, text };
  }

  if (mode === "numbers") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} number drill`,
      text: pickDeterministicItem(difficultyPack.numbers, `${id}-numbers`)
    };
  }

  if (mode === "punctuation") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} punctuation drill`,
      text: pickDeterministicItem(difficultyPack.punctuation, `${id}-punctuation`)
    };
  }

  if (mode === "code") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} ${pack.label} code`,
      text: pickDeterministicItem(difficultyPack.code, `${id}-code`)
    };
  }

  if (mode === "zen") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} ${pack.label} flow`,
      text:
        practiceView === "text"
          ? buildSentenceSequence(difficultyPack.sentences, Math.max(180, normalizedWordCount * 4), `${id}-zen-sentences`)
          : buildRandomWordSequence(difficultyPack.words, Math.max(180, normalizedWordCount * 4), `${id}-zen`)
    };
  }

  if (mode === "adaptive") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} ${pack.label} adaptive drill`,
      text: buildAdaptiveSequence(difficultyPack.words, weakKeys, weakWords, normalizedWordCount),
      wordCount: normalizedWordCount
    };
  }

  if (mode === "words") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} ${pack.label} word set`,
      text: buildWordSequence(normalizedWordCount),
      wordCount: normalizedWordCount
    };
  }

  if (mode === "time") {
    return {
      id,
      language,
      mode,
      source: `${difficultyTag} ${pack.label} timed flow`,
      text:
        practiceView === "text"
          ? buildSentenceSequence(difficultyPack.sentences, generatedWordCount, `${id}-time-sentences`)
          : buildWordSequence(generatedWordCount),
      wordCount: generatedWordCount
    };
  }

  return {
    id,
    language,
    mode,
    source: `${difficultyTag} ${pack.label} default`,
    text: difficultyPack.words.join(" ")
  };
}

export const LANGUAGE_PAGES = [
  {
    slug: "english-typing-test",
    title: "English Typing Test",
    language: "en" as const,
    intro: "Practice English typing with calm drills, richer language depth, and instant analytics."
  },
  {
    slug: "hindi-typing-test",
    title: "Hindi Typing Test",
    language: "hi" as const,
    intro: "Train Hindi typing with grapheme-aware scoring and deeper Devanagari practice material."
  },
  {
    slug: "improve-typing-speed",
    title: "Improve Typing Speed",
    language: "en" as const,
    intro: "Use richer content, trustworthy analytics, and repeatable practice loops to increase speed without losing accuracy."
  }
];
