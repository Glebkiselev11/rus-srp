export type DraftCategory = {
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
  image: string | null;
};

export type Category = {
  id: number;
  created_at: string;
  updated_at: string;
} & DraftCategory;
