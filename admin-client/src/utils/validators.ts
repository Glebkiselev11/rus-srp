import { INewWord, IWord } from "../models";

export function isWordValid(word: INewWord | IWord): boolean {
	return !Object
		.values(word)
		.some(w => w.length < 2);
} 
