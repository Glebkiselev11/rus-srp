import type { LanguageCode, Translation } from "@/types/translations";
import type { TranslateRequest } from "@/types/translations";
import { TranslationsApi } from "@/api";
import { LanguageList, LanguageCodes } from "@/i18n";

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

	const { from, text, to } = LanguageCodes.reduce((obj, lang) => {
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

export function getLanguageName(key: LanguageCode): string {
	return LanguageList.find(({ value }) => value === key)?.label || "Not found label";
}
