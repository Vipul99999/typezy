import { DifficultyContentPack } from "@/lib/types";

export function wordsFromText(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

export function pack(values: DifficultyContentPack): DifficultyContentPack {
  return values;
}
