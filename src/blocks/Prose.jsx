import { parseInlineCode } from "./inlineFormat.js";

export default function Prose({ body }) {
  return (
    <p className="my-4 font-body text-[1.0625rem] leading-[1.7] text-ink">
      {parseInlineCode(body).map((part, i) =>
        part.type === "code" ? (
          <code key={i} className="rounded-sm bg-card px-1 py-0.5 font-mono text-[0.9em] text-indigo">
            {part.value}
          </code>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </p>
  );
}
