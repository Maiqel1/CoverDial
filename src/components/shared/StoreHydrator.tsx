"use client";

import { useEffect } from "react";
import { useLetterStore } from "@/lib/store/letter-store";

/**
 * Rehydrates the persisted letter store from localStorage once, after mount.
 * Rendered near the root. Returns nothing — it exists only for its effect.
 * Paired with `skipHydration` in the store to prevent hydration mismatches.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useLetterStore.persist.rehydrate();
  }, []);
  return null;
}
