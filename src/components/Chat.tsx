"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Message } from "@/lib/ragflow";

function UserAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
      aria-hidden="true"
    >
      You
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary"
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 17l.8 2.4L8 20l-2.2.6L5 23l-.8-2.4L2 20l2.2-.6L5 17zm14 0l.8 2.4L22 20l-2.2.6L19 23l-.8-2.4L16 20l2.2-.6L19 17z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="message-in flex gap-3 px-4 sm:px-6">
      <AssistantAvatar />
      <div className="rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5" role="status" aria-label="Thinking">
          <span className="thinking-dot h-2 w-2 rounded-full bg-slate-400" />
          <span className="thinking-dot h-2 w-2 rounded-full bg-slate-400" />
          <span className="thinking-dot h-2 w-2 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 12h6M9 16h6M7 4h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-foreground">Ask about your documents</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
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
    <div className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {!hasMessages && !waiting ? (
          <EmptyState />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
            {messages.map((message, i) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={i}
                  className={`message-in flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  {isUser ? <UserAvatar /> : <AssistantAvatar />}
                  <div
                    className={`max-w-[min(100%,42rem)] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-tr-md bg-primary text-white"
                        : "rounded-tl-md border border-border bg-surface text-foreground"
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
        className="shrink-0 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-sm pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
      >
        <div className="mx-auto flex max-w-3xl gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="chat-question">Question</label>
          <input
            id="chat-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your documents..."
            aria-label="Question"
            className="min-h-11 flex-1 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-[0.9375rem] text-foreground shadow-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!question || waiting}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[5.5rem]"
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
