export function highlighTextByQuery(text: string, query: string): string {
	const regex = new RegExp(query, "gi");
	return text.replace(regex, match => `<mark>${match}</mark>`);
}
