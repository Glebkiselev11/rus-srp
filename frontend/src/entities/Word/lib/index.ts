import type { Word, DraftWord } from "../model/types";

export function convertWordToDraftWord(word: Word | DraftWord): DraftWord {
  return {
    id: word.id,
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
