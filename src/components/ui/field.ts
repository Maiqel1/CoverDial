// Shared control styling for text inputs, textareas and selects so every form
// field looks identical. Focus state = 1px black border + soft 2px muted glow
// (design/DESIGN.md > Components > Inputs).
export const fieldBase =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground " +
  "placeholder:text-subtle transition-colors " +
  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-muted " +
  "disabled:cursor-not-allowed disabled:opacity-50";
