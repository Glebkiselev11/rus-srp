import type { Id, ListResponse, OptionalRequestParams } from "@/types/api";
import type { Category, DraftCategory } from "@/types/categories";
import { ApiTransport } from "@/api/apiTransport";

export const CategoriesService = {
  ENDPOINT: "/api/v1/private/categories",

  async create(data: DraftCategory) {
    return await ApiTransport.post<Category>(`${this.ENDPOINT}/create`, data);
  },
  async query(params: OptionalRequestParams) {
    const { data } = await ApiTransport.query<ListResponse<Category>>(
      this.ENDPOINT,
      {
        params,
      }
    );

    return {
      categories: data.result,
      count: data.count,
      offset: data.offset,
    };
  },
  async getById(id: Id) {
    const { data } = await ApiTransport.get<Category>(`${this.ENDPOINT}/${id}`);
    return { category: data };
  },
  async update(id: Id, data: Category | DraftCategory) {
    return await ApiTransport.put<Category>(`${this.ENDPOINT}/${id}`, data);
  },
  async delete(id: Id) {
    return await ApiTransport.remove<void>(`${this.ENDPOINT}/${id}`);
  },
  async addWords(id: Id, word_ids: Id[]) {
    return await ApiTransport.put<void>(`${this.ENDPOINT}/${id}/add-words`, {
      word_ids,
    });
  },

  async deleteWords(id: Id, word_ids: Id[]) {
    return await ApiTransport.remove<void>(
      `${this.ENDPOINT}/${id}/delete-words`,
      {
        word_ids,
      }
    );
  },
};
