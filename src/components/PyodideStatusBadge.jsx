import { usePyodideContext } from "../hooks/PyodideProvider.jsx";

const LABELS = {
  loading: "Python: loading…",
  ready: "Python: ready",
  error: "Python: failed to load",
};

export default function PyodideStatusBadge() {
  const { status } = usePyodideContext();
  return (
    <span className="text-xs text-slate-500" data-status={status}>
      {LABELS[status] ?? status}
    </span>
  );
}
