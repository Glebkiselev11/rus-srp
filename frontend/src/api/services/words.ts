import type { Id, ListResponse, OptionalRequestParams } from "@/types/api";
import type { DraftWord, Word } from "@/types/words";
import { ApiTransport } from "@/api/apiTransport";
import { convertWordToDraftWord } from "@/common/utils";

export const WordsService = {
  ENDPOINT: "/api/v1/private/words",
  async create(data: DraftWord) {
    return await ApiTransport.post<Word>(`${this.ENDPOINT}/create`, data);
  },
  async query(params: OptionalRequestParams) {
    return await ApiTransport.query<ListResponse<Word>>(this.ENDPOINT, {
      params,
    });
  },
  async getById(id: Id) {
    const { data } = await ApiTransport.get<Word>(`${this.ENDPOINT}/${id}`);
    return data;
  },
  async update(id: Id, data: Word | DraftWord) {
    return ApiTransport.put<Word>(
      `${this.ENDPOINT}/${id}`,
      convertWordToDraftWord(data)
    );
  },
  async delete(id: Id) {
    return await ApiTransport.remove<void>(`${this.ENDPOINT}/${id}`);
  },
  async query_v2(params: OptionalRequestParams) {
    const { data } = await ApiTransport.query<ListResponse<Word>>(
      this.ENDPOINT,
      {
        params,
      }
    );

    return {
      words: data.result,
      count: data.count,
      offset: data.offset,
    };
  },
};
