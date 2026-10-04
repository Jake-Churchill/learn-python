import Prose from "./Prose.jsx";
import Heading from "./Heading.jsx";
import CodeBlock from "./CodeBlock.jsx";
import Exercise from "./Exercise.jsx";

export const blockRegistry = {
  prose: Prose,
  heading: Heading,
  example: CodeBlock,
  exercise: Exercise,
};
