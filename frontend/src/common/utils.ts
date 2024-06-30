export function highlighTextByQuery(text: string, query: string): string {
  const regex = new RegExp(query, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

export function isAnyFieldHasChanged(
  current: Record<string, unknown>,
  original: Record<string, unknown>
): boolean {
  return JSON.stringify(current) !== JSON.stringify(original);
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
