export interface ListResponse<T> {
  offset: number;
  count: number;
  result: Array<T>;
}

export type Order = "created_at" | "-created_at" | "-updated_at";

export interface RequestParams {
  search: string;
  offset: number;
  limit: number;
  order: Order;
}

export type OptionalRequestParams = Partial<RequestParams>;

export type TranslationTarget = "RU" | "EN" | "SR";

export interface TranslateRequest {
  from: string;
  targets: Array<TranslationTarget>;
  text: string;
}

export interface TranslateResponse {
  translations: Array<{ text: string; to: "bs" | "ru" | "en" }>;
}
