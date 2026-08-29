import { Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { getAdjacentLessons } from "../content/lessonUtils.js";

export default function LessonLayout({ lessons, progress, currentSlug, children }) {
  const { prev, next } = getAdjacentLessons(lessons, currentSlug);

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar lessons={lessons} progress={progress} />
      <main className="mx-auto max-w-2xl flex-1 px-8 py-12">
        {children}
        <div className="mt-12 flex justify-between border-t border-rule pt-6 font-mono text-sm">
          {prev ? (
            <Link to={`/lessons/${prev.slug}`} className="text-ink/60 transition-colors hover:text-indigo">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/lessons/${next.slug}`} className="text-ink/60 transition-colors hover:text-indigo">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
