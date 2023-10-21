export type DraftWord = {
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
  image: string | null;
}

export type Word = {
  id: number;
  created_at: string;
  updated_at: string;
} & DraftWord;
