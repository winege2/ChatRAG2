export default function Loading() {
  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5" role="status" aria-label="Loading">
          <span className="thinking-dot h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="thinking-dot h-2 w-2 rounded-full bg-slate-400" />
          <span className="thinking-dot h-2 w-2 rounded-full bg-slate-400" />
        </div>
        <p className="text-sm text-muted">Loading ChatRAG…</p>
      </div>
    </div>
  );
}
