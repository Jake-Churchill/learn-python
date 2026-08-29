export function parseInlineCode(text) {
  return text
    .split("`")
    .map((value, index) => ({
      type: index % 2 === 1 ? "code" : "text",
      value,
    }))
    .filter((part) => part.value.length > 0);
}
