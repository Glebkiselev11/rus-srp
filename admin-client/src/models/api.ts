export interface IListResponse<T> {
  offset: number,
  count: number,
  result: Array<T>
}

export interface IRequestParams {
  search?: string,
  offset?: number,
  limti?: number,
}

export type TranslationTarget = "RU" | "EN" | "SR"; 

export interface ITranslateRequest {
  from: string,
  targets: Array<TranslationTarget>,
  text: string
}

export interface ITranslateResponse {
  translations: Array<{text: string, to: "bs" | "ru" | "en"}>
}
