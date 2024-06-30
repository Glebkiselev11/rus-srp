export type LanguageCode = "eng" | "rus" | "srp_latin" | "srp_cyrillic";

export type TranslationObject = {
  [key in LanguageCode]: string;
};
