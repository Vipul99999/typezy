import { WeakMap } from "@/lib/types";

function rankEntries(map: WeakMap, limit: number): string[] {
  return Object.entries(map)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key]) => key.toLowerCase());
}

export function buildAdaptiveSequence(
  sampleWords: string[],
  weakKeys: WeakMap = {},
  weakWords: WeakMap = {},
  desiredWordCount = 35
): string {
  const topWeakKeys = rankEntries(weakKeys, 4);
  const topWeakWords = rankEntries(weakWords, 6);

  const weakWordPool = sampleWords.filter((word) => topWeakWords.includes(word.toLowerCase()));
  const keyMatchedPool = sampleWords.filter((word) =>
    topWeakKeys.some((key) => word.toLowerCase().includes(key))
  );

  const source = [...weakWordPool, ...weakWordPool, ...keyMatchedPool, ...sampleWords].filter(Boolean);
  const finalPool = source.length ? source : sampleWords;
  return Array.from({ length: desiredWordCount }, (_, index) => finalPool[index % finalPool.length]).join(" ");
}
