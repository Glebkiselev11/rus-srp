import type { Word, DraftWord } from "@/types/words";

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

export function convertWordToDraftWord(word: Word | DraftWord): DraftWord {
  return {
    rus: word.rus,
    eng: word.eng,
    srp_latin: word.srp_latin,
    srp_cyrillic: word.srp_cyrillic,
    image: word.image,
    translation_approved: word.translation_approved,
    category_ids:
      "categories" in word
        ? word.categories.map((category) => category.id)
        : word.category_ids,
  };
}
