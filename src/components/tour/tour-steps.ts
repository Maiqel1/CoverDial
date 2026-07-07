import type { DriveStep } from "driver.js";

/**
 * Guided-tour steps for the Generator screen. Each `element` matches a
 * `data-tour="…"` anchor placed on the real UI. Steps with no element render as
 * a centered modal.
 */
export const TOUR_STEPS: DriveStep[] = [
  {
    popover: {
      title: "Welcome to CoverDial 👋",
      description:
        "Turn your resume and a job posting into a tailored cover letter in seconds. Here's a 30-second tour.",
    },
  },
  {
    element: '[data-tour="nav"]',
    popover: {
      title: "Two screens",
      description:
        "Generate a letter here, then switch to the Editor to refine it. You can jump between them anytime.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="resume"]',
    popover: {
      title: "Add your resume",
      description:
        "Upload a PDF or DOCX (read right in your browser, never uploaded), or paste the text directly.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="job"]',
    popover: {
      title: "Paste the job description",
      description:
        "The AI reads this to match your experience to what the role actually asks for.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="options"]',
    popover: {
      title: "Set the tone & length",
      description:
        "Professional, confident, friendly, formal, and how long. Tweak and regenerate freely.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="generate"]',
    popover: {
      title: "Generate ✨",
      description: "One click and your tailored letter appears in the preview.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="preview"]',
    popover: {
      title: "Review, export, refine",
      description:
        "Your letter shows here. Hover to copy or download as PDF/DOCX, or open it in the Editor for AI-assisted edits.",
      side: "left",
      align: "start",
    },
  },
];
