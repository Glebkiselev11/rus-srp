import type { Id } from "./api";

export type DraftWord = {
  id?: Id;
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
  image: string | null;
}

export type Word = {
  id: Id;
  created_at: string;
  updated_at: string;
} & DraftWord;
