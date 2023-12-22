import type { Word, DraftWord } from "@/types/words";

export function highlighTextByQuery(text: string, query: string): string {
	const regex = new RegExp(query, "gi");
	return text.replace(regex, match => `<mark>${match}</mark>`);
}

export function addCropImagaeParamsToUrl(src: string, size: number): string {
	const url = new URL(src);
	url.searchParams.append("fit", "crop");
	url.searchParams.append("h", size.toString());
	url.searchParams.append("w", size.toString());
	return url.toString();
}

export function isAnyFieldHasChanged(
	current: Record<string, unknown>,
	original: Record<string, unknown>,
): boolean {
	return JSON.stringify(current) !== JSON.stringify(original);
}

export function translationPreview(obj: {
	rus: string;
	eng: string;
	srp_latin: string;
	srp_cyrillic: string;
}): string {
	return [
		obj.rus, 
		obj.eng, 
		obj.srp_latin, 
		obj.srp_cyrillic]
		.map(x => Boolean(x) ? x : " ? ")
		.join(" — ");
}

export function convertWordToDraftWord(word: Word | DraftWord): DraftWord {
	return {
		rus: word.rus,
		eng: word.eng,
		srp_latin: word.srp_latin,
		srp_cyrillic: word.srp_cyrillic,
		image: word.image,
		category_ids: "categories" in word 
			? word.categories.map(category => category.id) 
			: word.category_ids,
	};
}
