import { Link } from "react-router-dom";
import { lessons } from "../content/courses/python-core/lessonIndex.js";
import { useProgress } from "../hooks/useProgress.js";
import { getContinueLesson, isLessonComplete } from "../content/lessonUtils.js";

export default function Home() {
  const { progress } = useProgress();
  const continueLesson = getContinueLesson(lessons, progress);
  const completedCount = lessons.filter((lesson) => isLessonComplete(lesson, progress)).length;

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-paper px-8 py-16">
      <h1 className="mb-3 font-mono text-3xl font-semibold tracking-tight text-indigo">
        Learn Python
      </h1>
      <p className="mb-8 font-body text-lg leading-relaxed text-ink/80">
        A {lessons.length}-lesson course covering core Python syntax, written for someone who
        already knows HTML, CSS, and JavaScript. {completedCount} of {lessons.length} lessons
        complete.
      </p>
      <Link
        to={`/lessons/${continueLesson.slug}`}
        className="inline-flex items-center gap-2 rounded-sm bg-indigo px-4 py-2 font-mono text-sm text-paper transition-opacity hover:opacity-90"
      >
        <span aria-hidden="true">&gt;&gt;&gt;</span>
        {completedCount === 0 ? "Start the course" : "Continue where you left off"}
      </Link>
      <ol className="mt-10 space-y-1 border-t border-rule pt-6 font-mono text-sm">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              to={`/lessons/${lesson.slug}`}
              className="flex items-baseline gap-2 rounded-sm px-2 py-1 text-ink/70 hover:bg-card hover:text-indigo"
            >
              <span className="w-4 shrink-0 text-right text-xs tabular-nums text-ink/40">
                {isLessonComplete(lesson, progress) ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-body text-base">{lesson.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <footer className="mt-10 border-t border-rule pt-6 font-mono text-sm text-ink/50">
        Questions or feedback?{" "}
        <a href="mailto:warmonkey@jakechurchill.com" className="text-indigo hover:underline">
          warmonkey@jakechurchill.com
        </a>
      </footer>
    </div>
  );
}
