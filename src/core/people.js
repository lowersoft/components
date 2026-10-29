/** Up to two initials: "Ada Lovelace" -> "AL". */
export const initialsOf = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

/** A stable hue per name, so the same person always gets the same tint. */
export const hueOf = (name) => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)) % 3_600_000;
  return hash % 360;
};
