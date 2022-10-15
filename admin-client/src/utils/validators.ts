import { IDraftWord } from "../models";

export function isWordValid(word: IDraftWord): boolean {
	return !Object
		.values(word)
		.some(w => w.length < 2);
} 
