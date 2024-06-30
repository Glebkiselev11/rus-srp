import type { LanguageCode, TranslationObject } from "../model/types";
import { TranslationsService } from "../api";

export async function translate(
  params: TranslationObject
): Promise<TranslationObject> {
  try {
    const { data } = await TranslationsService.translate(params);
    return data;
  } catch (error) {
    console.error(error);
    return params;
  }
}
export function getLanguageCodesAccordingText(text: string): LanguageCode[] {
  const table = {
    rus: /^[а-яё\s]+$/i,
    srp_cyrillic: /^[абвгдђежзијклљмнњопрстћуфхцчџш\s]+$/i,
    srp_latin: /^[abcčćdđefghijklmnoprsštuvzž\s]+$/i,
    eng: /^[a-z\s]+$/i,
  };

  return Object.entries(table).reduce((codes, [key, value]) => {
    if (value.test(text)) {
      codes.push(key as LanguageCode);
    }
    return codes;
  }, [] as LanguageCode[]);
}

export function getLanguageLabel(key: LanguageCode): string {
  return {
    eng: "English",
    rus: "Русский",
    srp_latin: "Srpski",
    srp_cyrillic: "Српски",
  }[key];
}
