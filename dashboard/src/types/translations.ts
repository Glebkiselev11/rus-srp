export type TranslationKey = "Ru" | "En" | "SrpLatin" | "SrpCyrillic";

export type LanguageCode = "eng" | "rus" | "srp_latin" | "srp_cyrillic";

export type TranslateRequest = {
  from: TranslationKey;
  targets: Array<TranslationKey>;
  text: string;
}

export type Translation = {
  text: string;
  to: LanguageCode; 
}

export type TranslateResponse = {
  translations: Array<Translation>;
}
