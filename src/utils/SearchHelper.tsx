//helper function to Normalizes text for search comparison.
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

//helper function to Converts simple English plurals to their singular form.
export function singularize(word: string) {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("sses")) return word.slice(0, -2);
  if (word.endsWith("ses")) return word.slice(0, -1);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

//function to Tokenize text into normalized, singularized search terms.
export function tokenize(text: string) {
  return normalize(text).split(" ").map(singularize);
}
