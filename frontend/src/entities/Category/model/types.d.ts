import type { Id } from "@/shared/types";

export type DraftCategory = {
  id?: Id;
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
  image: string | null;
};

export type Category = {
  id: Id;
  created_at: string;
  updated_at: string;
  words_count: number;
} & DraftCategory;
