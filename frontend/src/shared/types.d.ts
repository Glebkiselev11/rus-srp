export type ListResponse<T> = {
  offset: number;
  count: number;
  result: Array<T>;
};

export type Id = number | string;

export type SortKey =
  | "created_at"
  | "updated_at"
  | "rus"
  | "eng"
  | "srp_latin"
  | "srp_cyrillic"
  | "image"
  | "category_count";

export type Order = `${SortKey}` | `-${SortKey}`;

export type RequestParams = {
  search?: string;
  offset?: number;
  limit: number;
  order?: Order;
  category_id?: Id;
  translation_approved_status?: TranslationApprovedStatus;
};

// exclude_approved - exclude approved translations, all - include all translations
export type TranslationApprovedStatus = "exclude_approved" | "all";

export type OptionalRequestParams = Partial<RequestParams>;
