"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Message } from "@/lib/ragflow";

function UserAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-semibold text-white"
      aria-hidden="true"
    >
      You
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-primary"
      aria-hidden="true"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l1.2 3.6L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3zM4 18l.7 2.1L7 21l-1.9.5L4 24l-.7-2.1L1 21l1.9-.5L4 18zm16 0l.7 2.1L23 21l-1.9.5L20 24l-.7-2.1L17 21l1.9-.5L20 18z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3 px-4 lg:px-8">
      <AssistantAvatar />
      <div
        className="rounded-xl border border-border bg-surface-muted px-4 py-3"
        role="status"
        aria-label="Thinking"
      >
        <div className="flex items-center gap-1.5">
          <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-muted)]" />
          <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-muted)]" />
          <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-muted)]" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-muted text-primary"
        aria-hidden="true"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
      </div>
      <h2 className="max-w-[18rem] text-lg font-semibold tracking-tight text-foreground sm:max-w-none">
        Ask about your documents
      </h2>
      <p className="mt-3 max-w-md text-[0.9375rem] leading-[1.6] text-muted">
        Type a question below. ChatRAG searches your company&apos;s knowledge base and returns an
        answer with context from approved sources.
      </p>
    </div>
  );
}

export function Chat({ sessionId, history }: { sessionId?: string; history: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(history);
  const [question, setQuestion] = useState("");
  const [waiting, setWaiting] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waiting]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setMessages([...messages, { role: "user", content: question }]);
    setQuestion("");
    setWaiting(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, sessionId }),
    });
    const data = await response.json();

    setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    setWaiting(false);
    // A new chat got a session: move to its URL, so it shows up in the list.
    if (!sessionId) router.push(`/?session=${data.sessionId}`);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {!hasMessages && !waiting ? (
          <EmptyState />
        ) : (
          <div className="mx-auto w-full max-w-[42rem] space-y-8 px-4 py-8 lg:px-8">
            {messages.map((message, i) => {
              const isUser = message.role === "user";
              return (
                <div key={i} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                  {isUser ? <UserAvatar /> : <AssistantAvatar />}
                  <div
                    className={`max-w-[min(100%,36rem)] whitespace-pre-wrap text-[0.9375rem] leading-[1.65] ${
                      isUser
                        ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-white"
                        : "border-l-2 border-primary/35 py-0.5 pl-4 text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
            {waiting && <ThinkingIndicator />}
            <div ref={scrollAnchorRef} className="h-px shrink-0" aria-hidden="true" />
          </div>
        )}
      </div>

      <form
        onSubmit={send}
        className="shrink-0 border-t border-border bg-surface-muted/80 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-8"
      >
        <div className="mx-auto flex max-w-[42rem] gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="chat-question">Question</label>
          <input
            id="chat-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your documents..."
            aria-label="Question"
            className="min-h-11 flex-1 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-primary focus:ring-[3px] focus:ring-primary/15"
          />
          <button
            type="submit"
            disabled={!question || waiting}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 sm:min-w-[5.25rem]"
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="sm:hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
