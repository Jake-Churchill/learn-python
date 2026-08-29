import { NavLink } from "react-router-dom";
import { isLessonComplete } from "../content/lessonUtils.js";
import PyodideStatusBadge from "./PyodideStatusBadge.jsx";

export default function Sidebar({ lessons, progress }) {
  return (
    <nav className="w-64 shrink-0 border-r border-slate-200 p-4">
      <NavLink to="/" className="mb-4 block font-semibold text-slate-900">
        Learn Python
      </NavLink>
      <ol className="space-y-1">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <NavLink
              to={`/lessons/${lesson.slug}`}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-2 py-1 text-sm ${
                  isActive ? "bg-slate-100 font-medium" : "text-slate-700"
                }`
              }
            >
              <span className="w-4 text-center">
                {isLessonComplete(lesson, progress) ? "✓" : i + 1}
              </span>
              {lesson.title}
            </NavLink>
          </li>
        ))}
      </ol>
      <div className="mt-4 border-t border-slate-200 pt-2">
        <PyodideStatusBadge />
      </div>
    </nav>
  );
}
