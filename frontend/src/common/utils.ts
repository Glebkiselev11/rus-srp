export function highlighTextByQuery(text: string, query: string): string {
  const regex = new RegExp(query, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

export function addCropImagaeParamsToUrl(src: string, size: number): string {
  const url = new URL(src);
  url.searchParams.append("fit", "crop");
  url.searchParams.append("h", size.toString());
  url.searchParams.append("w", size.toString());
  return url.toString();
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
