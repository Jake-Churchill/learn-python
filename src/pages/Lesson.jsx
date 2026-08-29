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
    return <p className="bg-paper p-8 font-body text-ink">Lesson not found.</p>;
  }

  return (
    <LessonLayout lessons={lessons} progress={progress} currentSlug={slug}>
      <h1 className="mb-6 font-mono text-2xl font-semibold tracking-tight text-indigo">
        {lesson.title}
      </h1>
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
