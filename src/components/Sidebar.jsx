import { NavLink, useMatch } from "react-router-dom";
import { getUnitProgress, groupByUnit, isLessonComplete } from "../content/lessonUtils.js";
import PyodideStatusBadge from "./PyodideStatusBadge.jsx";

export default function Sidebar({ lessons, progress }) {
  const currentSlug = useMatch("/lessons/:slug")?.params.slug;

  return (
    <nav className="sticky top-0 h-screen w-64 shrink-0 self-start overflow-y-auto border-r border-rule bg-paper p-4 font-mono">
      <NavLink to="/" className="mb-6 block text-sm font-semibold tracking-tight text-indigo">
        <span aria-hidden="true">&gt;&gt;&gt;</span> Learn Python
      </NavLink>
      <div className="space-y-1">
        {groupByUnit(lessons).map((group) => {
          const { done, total } = getUnitProgress(group, progress);
          const containsCurrent = group.items.some(({ lesson }) => lesson.slug === currentSlug);
          return (
            <details key={group.items[0].lesson.slug} open={containsCurrent} className="group">
              <summary className="flex cursor-pointer list-none items-baseline justify-between rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-widest text-ink/60 hover:bg-card [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline">
                  <span
                    aria-hidden="true"
                    className="mr-1 inline-block transition-transform group-open:rotate-90"
                  >
                    ›
                  </span>
                  <span>{group.unit}</span>
                </span>
                <span className="tabular-nums text-ink/40">
                  {done}/{total}
                </span>
              </summary>
              <ol className="mt-0.5 space-y-0.5">
                {group.items.map(({ lesson, number }) => (
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
                        {isLessonComplete(lesson, progress) ? "✓" : String(number).padStart(2, "0")}
                      </span>
                      <span className="truncate">{lesson.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ol>
            </details>
          );
        })}
      </div>
      <div className="mt-6 border-t border-rule pt-3">
        <PyodideStatusBadge />
      </div>
    </nav>
  );
}
