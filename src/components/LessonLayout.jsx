import { Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { getAdjacentLessons } from "../content/lessonUtils.js";

export default function LessonLayout({ lessons, progress, currentSlug, children }) {
  const { prev, next } = getAdjacentLessons(lessons, currentSlug);

  return (
    <div className="flex min-h-screen">
      <Sidebar lessons={lessons} progress={progress} />
      <main className="mx-auto max-w-2xl flex-1 px-6 py-8">
        {children}
        <div className="mt-8 flex justify-between border-t border-slate-200 pt-4 text-sm">
          {prev ? (
            <Link to={`/lessons/${prev.slug}`} className="text-slate-600 hover:underline">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/lessons/${next.slug}`} className="text-slate-600 hover:underline">
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
