export function getExerciseIds(lesson) {
  return lesson.blocks.filter((block) => block.type === "exercise").map((block) => block.id);
}

export function isLessonComplete(lesson, progress) {
  const exerciseIds = getExerciseIds(lesson);
  const lessonProgress = progress[lesson.slug] || {};
  return exerciseIds.length > 0 && exerciseIds.every((id) => lessonProgress[id]);
}

export function getContinueLesson(lessons, progress) {
  return (
    lessons.find((lesson) => !isLessonComplete(lesson, progress)) || lessons[lessons.length - 1]
  );
}

export function getAdjacentLessons(lessons, currentSlug) {
  const index = lessons.findIndex((lesson) => lesson.slug === currentSlug);
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}
