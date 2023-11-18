import type { LanguageCode, Translation } from "@/types/translations";
import type { TranslateRequest } from "@/types/translations";
import { TranslationsApi } from "@/api";
import { LanguageList } from "@/i18n";

export async function translate(
	from: LanguageCode, 
	to: LanguageCode[], 
	text: string,
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

export function getLanguageName(key: LanguageCode): string {
	return LanguageList.find(({ value }) => value === key)?.label || "Not found label";
}
