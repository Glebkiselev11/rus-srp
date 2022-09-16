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