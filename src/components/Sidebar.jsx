import { NavLink } from "react-router-dom";
import { isLessonComplete } from "../content/lessonUtils.js";
import PyodideStatusBadge from "./PyodideStatusBadge.jsx";

export default function Sidebar({ lessons, progress }) {
  return (
    <nav className="w-64 shrink-0 border-r border-rule bg-paper p-4 font-mono">
      <NavLink to="/" className="mb-6 block text-sm font-semibold tracking-tight text-indigo">
        <span aria-hidden="true">&gt;&gt;&gt;</span> Learn Python
      </NavLink>
      <ol className="space-y-0.5">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <NavLink
              to={`/lessons/${lesson.slug}`}
              className={({ isActive }) =>
                `flex items-baseline gap-2 rounded-sm px-2 py-1 text-sm ${
                  isActive
                    ? "border-l-2 border-indigo bg-card font-medium text-indigo"
                    : "border-l-2 border-transparent text-ink/70 hover:border-rule hover:bg-card"
                }`
              }
            >
              <span className="w-4 shrink-0 text-right text-xs tabular-nums text-ink/40">
                {isLessonComplete(lesson, progress) ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{lesson.title}</span>
            </NavLink>
          </li>
        ))}
      </ol>
      <div className="mt-6 border-t border-rule pt-3">
        <PyodideStatusBadge />
      </div>
    </nav>
  );
}
