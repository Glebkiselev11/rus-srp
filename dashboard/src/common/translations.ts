import type { LanguageCode, Translation } from "@/types/translations";
import type { TranslateRequest } from "@/types/translations";
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

export async function translate(
	from: LanguageCode, 
	text: string,
	to: LanguageCode[], 
): Promise<Translation[]> {
	const Table = {
		"eng": "En",
		"rus": "Ru",
		"srp_latin": "SrpLatin",
		"srp_cyrillic": "SrpCyrillic",
	} as const;

	const params: TranslateRequest = {
		from: Table[from],
		targets: to.map((lang) => Table[lang]),
		text,
	};

	try {
		const { data } = await TranslationsApi.translate(params);
		return data.translations;
	} catch (error) {
		console.error(error);
		return [];
	}
}

type AutoTranslateParams = {
	eng: string;
	rus: string;
	srp_latin: string;
	srp_cyrillic: string;
}
 
export async function autoTranslate(params: AutoTranslateParams): Promise<AutoTranslateParams> {
	const init = {
		from: null as LanguageCode | null,
		text: "",
		to: [] as LanguageCode[],
	};

	const { from, text, to } = getLanguageCodesOrder().reduce((obj, lang) => {
		if (!params[lang]) {
			obj.to.push(lang);
		} else if (!obj.from) {
			obj.from = lang;
			obj.text = params[lang];
		}
		return obj;
	}, init);

	if (!from || !text || !to.length) {
		return params;
	}

	return translate(from, text, to)
		.then((list) => list.reduce((obj, { text, to }) => {
			obj[to] = text;
			return obj;
		}, { ...params }));
}
