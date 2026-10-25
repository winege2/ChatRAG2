export default function Loading() {
  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5" role="status" aria-label="Loading">
          <span className="thinking-dot h-2 w-2 rounded-full bg-[var(--accent-muted)]" />
          <span className="thinking-dot h-2 w-2 rounded-full bg-[var(--accent-muted)]" />
          <span className="thinking-dot h-2 w-2 rounded-full bg-[var(--accent-muted)]" />
        </div>
        <p className="text-[0.875rem] text-muted">Loading ChatRAG</p>
      </div>
    </div>
  );
}
