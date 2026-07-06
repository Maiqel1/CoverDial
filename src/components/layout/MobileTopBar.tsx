import { Icon } from "@/components/ui";

/** Slim top bar shown only below `lg`, with the menu trigger and wordmark. */
export function MobileTopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-muted px-4 lg:hidden">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation menu"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted-hover hover:text-foreground"
      >
        <Icon name="menu" size={24} />
      </button>
      <span className="text-lg font-black tracking-tighter text-foreground">
        CoverDial
      </span>
    </div>
  );
}
