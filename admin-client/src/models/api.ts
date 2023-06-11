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

export interface ITranslateRequest {
  from: string,
  targets: Array<string>,
  text: string
}

export interface ITranslateResponse {
  translations: Array<{text: string, to: "sr-Latn" | "ru" | "en"}>
}
