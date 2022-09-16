import { IWord } from "../models";

interface WordItemProps {
  word: IWord
}

export function WordItem({ word }: WordItemProps) {

	return (
		<div className="border border-gray-200 py-2 px-4">{word.rus} - {word.srp_cyrillic} - {word.srp_latin}</div>
	);
}
