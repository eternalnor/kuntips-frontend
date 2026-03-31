import { Filter } from "bad-words";

const filter = new Filter();

/**
 * Returns true if the text contains profanity or blocked content.
 * Uses the bad-words package for a comprehensive, community-maintained list.
 */
export function containsBlockedContent(text) {
  if (!text || typeof text !== "string") return false;
  try {
    return filter.isProfane(text);
  } catch {
    return false;
  }
}
