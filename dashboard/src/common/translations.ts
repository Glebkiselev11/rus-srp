import type { LanguageCode, TranslationObject } from "@/types/translations";
import { TranslationsApi } from "@/api";
import i18n from "@/i18n";

export function getLanguageCodesOrder(): LanguageCode[] {
	const currentLanguage = i18n.global.locale as LanguageCode;
	switch (currentLanguage) {
	case "eng":
		return ["eng", "srp_latin", "srp_cyrillic", "rus"];
	case "rus":
		return ["rus",  "srp_cyrillic", "srp_latin", "eng"];
	case "srp_latin":
		return ["srp_latin", "eng", "srp_cyrillic", "rus"];
	case "srp_cyrillic":
		return ["srp_cyrillic", "rus", "srp_latin", "eng"];
	}
}

export function getLanguageLabel(key: LanguageCode): string {
	return { eng: "English", rus: "Русский", srp_latin: "Srpski", srp_cyrillic: "Српски" }[key];
}

export function getLanguageList() {
	return getLanguageCodesOrder()
		.map((value) => ({ value, label: getLanguageLabel(value) }));
} 

export function translationPreview(obj: TranslationObject): string {
	return getLanguageCodesOrder()
		.map((key) => obj[key])
		.map(x => Boolean(x) ? x : " ? ")
		.join(" — ");
}

export function extractCurrentLanguageTranslation(obj: TranslationObject): string {
	const currentLanguage = i18n.global.locale as LanguageCode;
	return obj[currentLanguage];
}

export async function translate(params: TranslationObject): Promise<TranslationObject> {
	try {
		const { data } = await TranslationsApi.translate(params);
		return data;
	} catch (error) {
		console.error(error);
		return params;
	}
}
