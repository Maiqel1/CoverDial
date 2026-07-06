"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileTopBar } from "./MobileTopBar";

/**
 * App-wide layout frame: persistent Sidebar + a flexible content region.
 * Owns the mobile drawer open/close state (the sidebar is a static column at
 * lg+, an off-canvas drawer below it). Each page renders its own header, body
 * and Footer inside `children`.
 *
 * The drawer closes via `onNavigate` (every nav link) and the backdrop — the
 * only ways to leave a screen from the drawer — so no route-watching effect is
 * needed.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar isOpen={drawerOpen} onNavigate={() => setDrawerOpen(false)} />

      {/* Backdrop (mobile only, when the drawer is open) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in lg:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar onMenu={() => setDrawerOpen(true)} />
        {children}
      </div>
    </div>
  );
}
