export type ListResponse<T> = {
  offset: number;
  count: number;
  result: Array<T>;
}

export type Order = 
  "created_at" | 
  "-created_at" | 
  "-updated_at" | 
  "updated_at" | 
  "rus" | 
  "-rus" | 
  "eng" | 
  "-eng" | 
  "srp_latin" | 
  "-srp_latin" |
  "srp_cyrillic" |
  "-srp_cyrillic" |
  "image" |
  "-image"; 

export type RequestParams = {
  search: string;
  offset: number;
  limit: number;
  order?: Order;
  category_id?: number;
}

export type OptionalRequestParams = Partial<RequestParams>;

export type TranslationTarget = "RU" | "EN" | "SR";

export type TranslateRequest = {
  from: string;
  targets: Array<TranslationTarget>;
  text: string;
}

export type TranslateResponse = {
  translations: Array<{ text: string; to: "bs" | "ru" | "en" }>;
}

export type Load = "initial" | "loading" | "loaded" | "error";
