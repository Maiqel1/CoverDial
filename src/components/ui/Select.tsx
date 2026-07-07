"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "./Icon";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  id?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * A custom listbox dropdown (replacing the flat native <select>): animated open,
 * checkmark on the active option, full keyboard support, and outside-click /
 * Escape to close. Controlled - pairs with a React Hook Form `Controller`.
 */
export function Select({
  value,
  onChange,
  options,
  id,
  ariaLabel,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value) ?? options[0];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function openMenu() {
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function choose(index: number) {
    const opt = options[index];
    if (opt) onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-surface px-3 py-2.5 text-left text-sm text-foreground",
          "transition-all duration-150 hover:border-subtle",
          open
            ? "border-primary ring-2 ring-muted"
            : "border-border",
        )}
      >
        <span>{selected?.label}</span>
        <Icon
          name="expand_more"
          size={20}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          id={listId}
          aria-activedescendant={`${listId}-${activeIndex}`}
          className="absolute z-30 mt-2 w-full origin-top overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-lift animate-scale-in"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                {opt.label}
                {isSelected && (
                  <Icon name="check" size={18} className="text-primary" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
