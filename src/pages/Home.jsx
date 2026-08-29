import { Link } from "react-router-dom";
import { lessons } from "../content/courses/python-core/lessonIndex.js";
import { useProgress } from "../hooks/useProgress.js";
import { getContinueLesson, isLessonComplete } from "../content/lessonUtils.js";

export default function Home() {
  const { progress } = useProgress();
  const continueLesson = getContinueLesson(lessons, progress);
  const completedCount = lessons.filter((lesson) => isLessonComplete(lesson, progress)).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold text-slate-900">Learn Python</h1>
      <p className="mb-6 text-slate-600">
        A {lessons.length}-lesson course covering core Python syntax, written for someone who
        already knows HTML, CSS, and JavaScript. {completedCount} of {lessons.length} lessons
        complete.
      </p>
      <Link
        to={`/lessons/${continueLesson.slug}`}
        className="inline-block rounded bg-slate-800 px-4 py-2 text-white"
      >
        {completedCount === 0 ? "Start the course" : "Continue where you left off"}
      </Link>
      <ol className="mt-8 space-y-1">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link to={`/lessons/${lesson.slug}`} className="text-slate-700 hover:underline">
              {isLessonComplete(lesson, progress) ? "✓" : i + 1}. {lesson.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
