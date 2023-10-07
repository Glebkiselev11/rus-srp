export interface DraftCategory {
  // TODO: add those fields
  // rus: string;
  // eng: string;
  // srp_latin: string;
  // srp_cyrillic: string;
  // image: string | null;
  name: string;
}

export interface Category extends DraftCategory {
  id: number;
  created_at: string;
  updated_at: string;
}
