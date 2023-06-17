import { IDraftWord } from "../models";

export function isWordValid(word: IDraftWord): boolean {
  const { rus, srp_latin, eng } = word;
  return Boolean(rus && srp_latin && eng);
}
