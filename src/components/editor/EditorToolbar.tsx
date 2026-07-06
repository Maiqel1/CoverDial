"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolButton {
  icon: string;
  label: string;
  run: (e: Editor) => void;
  isActive?: (e: Editor) => boolean;
  canRun?: (e: Editor) => boolean;
}

const BUTTONS: (ToolButton | "divider")[] = [
  {
    icon: "undo",
    label: "Undo",
    run: (e) => e.chain().focus().undo().run(),
    canRun: (e) => e.can().undo(),
  },
  {
    icon: "redo",
    label: "Redo",
    run: (e) => e.chain().focus().redo().run(),
    canRun: (e) => e.can().redo(),
  },
  "divider",
  {
    icon: "format_bold",
    label: "Bold",
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive("bold"),
  },
  {
    icon: "format_italic",
    label: "Italic",
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive("italic"),
  },
  {
    icon: "format_underlined",
    label: "Underline",
    run: (e) => e.chain().focus().toggleUnderline().run(),
    isActive: (e) => e.isActive("underline"),
  },
  "divider",
  {
    icon: "format_list_bulleted",
    label: "Bullet list",
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive("bulletList"),
  },
];

/** Formatting toolbar bound to the shared Tiptap editor instance. */
export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-border bg-muted p-3">
      {BUTTONS.map((btn, i) => {
        if (btn === "divider") {
          return <div key={`d${i}`} className="mx-1 h-6 w-px bg-border" />;
        }
        const active = editor ? btn.isActive?.(editor) ?? false : false;
        const disabled = !editor || (btn.canRun ? !btn.canRun(editor) : false);
        return (
          <button
            key={btn.icon}
            type="button"
            aria-label={btn.label}
            aria-pressed={active}
            title={btn.label}
            disabled={disabled}
            onClick={() => editor && btn.run(editor)}
            className={cn(
              "rounded p-2 transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted-hover hover:text-foreground",
              disabled && "opacity-40 hover:bg-transparent hover:text-muted-foreground",
            )}
          >
            <Icon name={btn.icon} size={20} />
          </button>
        );
      })}
    </div>
  );
}
