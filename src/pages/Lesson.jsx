import { useParams } from "react-router-dom";
import { lessons } from "../content/courses/python-core/lessonIndex.js";
import { useProgress } from "../hooks/useProgress.js";
import { blockRegistry } from "../blocks/registry.js";
import LessonLayout from "../components/LessonLayout.jsx";

export default function Lesson() {
  const { slug } = useParams();
  const { progress, markExerciseComplete } = useProgress();
  const lesson = lessons.find((l) => l.slug === slug);

  if (!lesson) {
    return <p className="p-8">Lesson not found.</p>;
  }

  return (
    <LessonLayout lessons={lessons} progress={progress} currentSlug={slug}>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">{lesson.title}</h1>
      {lesson.blocks.map((block, i) => {
        const Component = blockRegistry[block.type];
        return (
          <Component
            key={`${lesson.slug}-${i}`}
            {...block}
            lessonSlug={lesson.slug}
            onExercisePass={markExerciseComplete}
          />
        );
      })}
    </LessonLayout>
  );
}
