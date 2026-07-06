import { Footer } from "@/components/layout/Footer";
import { EditorView } from "@/components/editor/EditorView";
import { LetterActions } from "@/components/shared/LetterActions";
import { Chip } from "@/components/ui";

export const metadata = {
  title: "Editor — CoverDial",
};

export default function EditorPage() {
  return (
    // Fixed viewport height so the document canvas scrolls internally (app-like).
    // Below lg, subtract the mobile top bar (3.5rem) so nothing overflows.
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden lg:h-screen">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-4 md:px-10">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <h2 className="truncate text-lg font-bold text-foreground md:text-2xl">
            Edit Cover Letter
          </h2>
          {/* Honest status: this is a working draft held in the browser — no cloud. */}
          <Chip icon="edit_note" className="hidden sm:inline-flex">
            Draft
          </Chip>
        </div>
        {/* Icon actions on mobile, full labelled bar on desktop. */}
        <LetterActions variant="compact" className="shrink-0 md:hidden" />
        <LetterActions variant="bar" className="hidden shrink-0 md:flex" />
      </header>

      <EditorView />

      <Footer variant="compact" />
    </div>
  );
}
