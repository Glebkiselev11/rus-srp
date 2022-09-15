import { IWord } from "../models";

interface WordItemProps {
  word: IWord
}

export function WordItem({ word }: WordItemProps) {

	return (
		<div>{word.rus} - {word.srp_cyrillic} - {word.srp_latin}</div>
	);
}
