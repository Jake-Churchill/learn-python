import { parseInlineCode } from "./inlineFormat.js";

export default function Prose({ body }) {
  return (
    <p className="my-3 leading-relaxed text-slate-800">
      {parseInlineCode(body).map((part, i) =>
        part.type === "code" ? (
          <code key={i} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm">
            {part.value}
          </code>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </p>
  );
}
