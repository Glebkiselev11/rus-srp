export interface DraftWord {
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
  image: string | null;
}

export interface Word extends DraftWord {
  id: number;
  created_at: string;
  updated_at: string;
}
