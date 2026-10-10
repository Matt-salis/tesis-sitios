export function Accent({ text }) {
  const parts = String(text || "").split(/(\*[^*]+\*)/g);
  return parts.map((part, index) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <em key={index}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}
