import type { Id, ListResponse, OptionalRequestParams } from "@/types/api";
import type { Category, DraftCategory } from "@/types/categories";
import { ApiTransport } from "@/api/apiTransport";

export const CategoriesService = {
  ENDPOINT: "/api/v1/private/categories",

  create(data: DraftCategory) {
    return ApiTransport.post<Category>(`${this.ENDPOINT}/create`, data);
  },
  query(params: OptionalRequestParams) {
    return ApiTransport.query<ListResponse<Category>>(this.ENDPOINT, {
      params,
    });
  },
  update(id: Id, data: Category | DraftCategory) {
    return ApiTransport.put<Category>(`${this.ENDPOINT}/${id}`, data);
  },
  delete(id: Id) {
    return ApiTransport.remove<void>(`${this.ENDPOINT}/${id}`);
  },
  addWords(id: Id, word_ids: Id[]) {
    return ApiTransport.put<void>(`${this.ENDPOINT}/${id}/add-words`, {
      word_ids,
    });
  },
};
