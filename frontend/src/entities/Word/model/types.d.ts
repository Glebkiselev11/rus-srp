import type { Id } from "@/shared/types";
import type { Category } from "@/entities/Category";

type WordBase = {
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
  image: string | null;
  translation_approved: boolean;
};

export type DraftWord = {
  category_ids: Id[];
  id?: Id;
} & WordBase;

export type Word = {
  id: Id;
  created_at: string;
  updated_at: string;
  categories: Category[];
} & WordBase;
