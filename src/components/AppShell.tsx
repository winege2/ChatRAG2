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
        strokeWidth="1.75"
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
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentStackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 4h-4a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V9l-5-5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 4v5h5M9 13h6M9 17h4"
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
          className="fixed inset-0 z-40 bg-[#141c26]/50 lg:hidden"
          onClick={closeNav}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r border-border bg-surface-muted transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white"
              aria-hidden="true"
            >
              <DocumentStackIcon />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-semibold tracking-tight text-foreground">
                ChatRAG
              </p>
              <p className="truncate text-[0.8125rem] text-muted">Company documents</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
            onClick={closeNav}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-4 pb-3">
          <Link
            href="/"
            onClick={closeNav}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="text-base leading-none" aria-hidden="true">+</span>
            New chat
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-5" aria-label="Past chats">
          {sessions.length === 0 ? (
            <p className="px-2 py-1 text-[0.8125rem] leading-relaxed text-muted">
              Start a chat to see it here.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {sessions.map((s) => {
                const active = s.id === sessionId;
                return (
                  <li key={s.id}>
                    <Link
                      href={`/?session=${s.id}`}
                      onClick={closeNav}
                      className={`block truncate rounded-md px-2.5 py-2 text-[0.875rem] leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
                        active
                          ? "bg-primary-soft font-medium text-primary"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                      title={s.name}
                    >
                      {s.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-surface">
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5 lg:px-8">
          <button
            type="button"
            className="rounded-md border border-border bg-surface-muted p-2 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground lg:hidden"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[0.9375rem] font-semibold text-foreground sm:text-base">
              Document assistant
            </h1>
            <p className="hidden truncate text-[0.8125rem] text-muted sm:block">
              Answers from your organization&apos;s knowledge base
            </p>
          </div>
        </header>

        <Chat key={sessionId ?? "new"} sessionId={sessionId} history={history} />
      </div>
    </div>
  );
}
