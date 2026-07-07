"use client";

import { EditorContent, type Editor } from "@tiptap/react";

/** The document canvas - renders the shared Tiptap editor with letter typography. */
export function RichTextEditor({ editor }: { editor: Editor | null }) {
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-8 text-base text-foreground md:p-16">
      <EditorContent editor={editor} />
    </div>
  );
}
