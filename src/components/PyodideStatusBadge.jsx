import { usePyodideContext } from "../hooks/PyodideProvider.jsx";

const LABELS = {
  loading: "Python: loading…",
  ready: "Python: ready",
  error: "Python: failed to load",
};

const DOT_COLOR = {
  loading: "bg-amber",
  ready: "bg-pine",
  error: "bg-rust",
};

export default function PyodideStatusBadge() {
  const { status } = usePyodideContext();
  return (
    <span className="flex items-center gap-1.5 text-xs text-ink/50" data-status={status}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[status] ?? "bg-ink/30"}`} aria-hidden="true" />
      {LABELS[status] ?? status}
    </span>
  );
}
