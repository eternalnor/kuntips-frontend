import { useEffect } from "react";

/**
 * Sets document.title for the current page.
 * Pass null/undefined to get just "KunTips".
 * Pass a string to get "<title> — KunTips".
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — KunTips` : "KunTips";
  }, [title]);
}
