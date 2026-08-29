import Prose from "./Prose.jsx";
import CodeBlock from "./CodeBlock.jsx";
import Exercise from "./Exercise.jsx";

export const blockRegistry = {
  prose: Prose,
  example: CodeBlock,
  exercise: Exercise,
};
