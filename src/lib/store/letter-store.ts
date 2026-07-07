import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * The one piece of genuinely shared, cross-page state: the current cover
 * letter. The Generator writes it after a successful generation; the Editor
 * reads and edits it.
 *
 * Persisted to localStorage so a page refresh keeps your work (no server/DB).
 * `skipHydration` is on: the store starts empty to match the server render,
 * then `StoreHydrator` rehydrates it from localStorage after mount - avoiding
 * React hydration mismatches in the App Router.
 */
interface LetterState {
  letter: string | null;
  setLetter: (letter: string) => void;
  clearLetter: () => void;
}

export const useLetterStore = create<LetterState>()(
  persist(
    (set) => ({
      letter: null,
      setLetter: (letter) => set({ letter }),
      clearLetter: () => set({ letter: null }),
    }),
    {
      name: "coverdial-letter",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
