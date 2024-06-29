import type { Id } from "@/types/api";

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
} & DraftCategory;
