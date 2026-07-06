"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLetterStore } from "@/lib/store/letter-store";
import { letterTextToHtml } from "@/lib/utils/letter-format";
import { Icon } from "@/components/ui";
import { EditorToolbar } from "./EditorToolbar";
import { RichTextEditor } from "./RichTextEditor";
import { AiAssistantPanel } from "./AiAssistantPanel";

/**
 * The Editor screen container. Creates the single Tiptap instance shared by the
 * toolbar, canvas and AI Assistant; loads the letter from the store; and keeps
 * the store in sync as the user (or the AI) edits.
 */
export function EditorView() {
  const letter = useLetterStore((s) => s.letter);
  const setLetter = useLetterStore((s) => s.setLetter);

  const editor = useEditor({
    extensions: [StarterKit],
    // Avoid SSR hydration mismatches in the App Router.
    immediatelyRender: false,
    content: letter ? letterTextToHtml(letter) : "",
    editorProps: {
      attributes: { class: "min-h-[60vh] max-w-none focus:outline-none" },
    },
    // Mirror manual edits into the shared store (plain text, blank-line paras).
    onUpdate: ({ editor }) => {
      setLetter(editor.getText({ blockSeparator: "\n\n" }));
    },
  });

  // If the letter arrives after mount (localStorage rehydration on a fresh page
  // load), populate the still-empty editor. Guarded so it never clobbers edits.
  useEffect(() => {
    if (editor && letter && editor.getText().trim() === "") {
      editor.commands.setContent(letterTextToHtml(letter));
    }
  }, [editor, letter]);

  // No letter yet → guide the user to the Generator instead of showing a blank editor.
  if (!letter) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <Icon name="history_edu" size={56} className="text-subtle" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          No cover letter yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Generate a letter first, then refine it here with the rich-text editor
          and AI Assistant.
        </p>
        <Link
          href="/generator"
          className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Icon name="edit_note" size={20} />
          Go to Generator
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      {/* Document canvas */}
      <section className="custom-scrollbar flex flex-1 justify-center overflow-y-auto bg-canvas p-6 md:p-12">
        <div className="flex min-h-[1056px] w-full max-w-3xl flex-col border border-border bg-surface shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <EditorToolbar editor={editor} />
          <RichTextEditor editor={editor} />
        </div>
      </section>

      {/* AI Assistant */}
      <AiAssistantPanel
        getCurrentText={() =>
          editor?.getText({ blockSeparator: "\n\n" }) ?? ""
        }
        onRevised={(text) => {
          editor?.commands.setContent(letterTextToHtml(text));
          setLetter(text);
        }}
      />
    </div>
  );
}
