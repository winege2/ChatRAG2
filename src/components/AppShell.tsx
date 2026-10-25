"use client";

import Link from "next/link";
import { useState } from "react";
import { Chat } from "@/components/Chat";
import type { Message } from "@/lib/ragflow";

type SessionItem = { id: string; name: string };

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentStackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12h6M9 16h6M7 4h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppShell({
  sessions,
  sessionId,
  history,
}: {
  sessions: SessionItem[];
  sessionId?: string;
  history: Message[];
}) {
  const [navOpen, setNavOpen] = useState(false);

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {navOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeNav}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r border-border bg-surface shadow-xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <DocumentStackIcon />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">ChatRAG</p>
              <p className="truncate text-xs text-muted">Company documents</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
            onClick={closeNav}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-3">
          <Link
            href="/"
            onClick={closeNav}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)]"
          >
            <span className="text-lg leading-none" aria-hidden="true">+</span>
            New chat
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4" aria-label="Past chats">
          {sessions.length === 0 ? (
            <p className="px-3 py-2 text-xs leading-relaxed text-muted">No conversations yet.</p>
          ) : (
            sessions.map((s) => {
              const active = s.id === sessionId;
              return (
                <Link
                  key={s.id}
                  href={`/?session=${s.id}`}
                  onClick={closeNav}
                  className={`block truncate rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-primary-soft font-medium text-primary"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`}
                  title={s.name}
                >
                  {s.name}
                </Link>
              );
            })
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-sm lg:px-6">
          <button
            type="button"
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
              Document assistant
            </h1>
            <p className="hidden truncate text-xs text-muted sm:block">
              Answers grounded in your organization&apos;s knowledge base
            </p>
          </div>
        </header>

        <Chat key={sessionId ?? "new"} sessionId={sessionId} history={history} />
      </div>
    </div>
  );
}
