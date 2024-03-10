export type TranslationKey = "Ru" | "En" | "SrpLatin" | "SrpCyrillic";

export type LanguageCode = "eng" | "rus" | "srp_latin" | "srp_cyrillic";

export type TranslationObject = {
	[key in LanguageCode]: string;
}
