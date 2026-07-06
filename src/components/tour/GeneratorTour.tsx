"use client";

import { useCallback, useEffect } from "react";
import { driver } from "driver.js";
import { Icon } from "@/components/ui";
import { TOUR_STEPS } from "./tour-steps";

const SEEN_KEY = "coverdial-tour-v1";

/**
 * Guided product tour for the Generator, powered by driver.js.
 * - Auto-runs once on a user's first visit (desktop widths, where all anchors
 *   are visible), then remembers via localStorage.
 * - Always replayable via the "Take a tour" button.
 */
export function GeneratorTour() {
  const startTour = useCallback(() => {
    const d = driver({
      showProgress: true,
      popoverClass: "coverdial-tour",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      steps: TOUR_STEPS,
      onDestroyed: () => {
        try {
          localStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* ignore storage failures */
        }
      },
    });
    d.drive();
  }, []);

  // First-visit auto-start (desktop only — the sidebar/anchors are hidden on mobile).
  useEffect(() => {
    let seen = "1";
    try {
      seen = localStorage.getItem(SEEN_KEY) ?? "";
    } catch {
      seen = "1";
    }
    if (seen) return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    // Let the page (and fonts) settle before highlighting elements.
    const t = setTimeout(startTour, 700);
    return () => clearTimeout(t);
  }, [startTour]);

  return (
    <button
      type="button"
      onClick={startTour}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground hover:shadow-lift"
    >
      <Icon name="help_outline" size={16} />
      Take a tour
    </button>
  );
}
