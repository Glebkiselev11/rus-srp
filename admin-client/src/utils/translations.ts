import { IDraftWord } from "../models";
import { ITranslateResponse, TranslationTarget } from "../models/api";

export function getTranslationTargets(newWord: IDraftWord) {
  const table: Record<keyof typeof newWord, TranslationTarget> = {
    srp_latin: "SR",
    rus: "RU",
    eng: "EN",
  };

  const translationFromPriority = ["RU", "SR", "EN"];

  const targets: Array<TranslationTarget> = [];
  const fromMap: Map<string, string> = new Map();

  for (const key of Object.keys(newWord) as Array<keyof typeof newWord>) {
    const value = newWord[key];
    if (value) {
      fromMap.set(table[key], value);
    } else {
      targets.push(table[key]);
    }
  }

  const fromCode = translationFromPriority.find((key) => fromMap.has(key));

  return {
    targets,
    from: fromCode,
    text: fromCode ? fromMap.get(fromCode) : "",
  };
}

export function fillDrafWordWithTranslation(
  { translations }: ITranslateResponse,
  word: IDraftWord
): IDraftWord {
  const table = {
    bs: "srp_latin",
    ru: "rus",
    en: "eng",
  };

  const _word = {
    ...word,
  };

  translations.forEach(({ text, to }) => {
    const key = table[to] as keyof IDraftWord;
    _word[key] = text;
  });

  return _word;
}
