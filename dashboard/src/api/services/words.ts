import type { Id, ListResponse, OptionalRequestParams } from "@/types/api";
import type { DraftWord, Word } from "@/types/words";
import { ApiTransport } from "@/api/apiTransport";

export const WordsService = {
  ENDPOINT: "/api/v1/private/words",
  create(data: DraftWord) {
    return ApiTransport.post<Word>(`${this.ENDPOINT}/create`, data);
  },
  query(params: OptionalRequestParams) {
    return ApiTransport.query<ListResponse<Word>>(this.ENDPOINT, { params });
  },
  getById(id: Id) {
    return ApiTransport.get<Word>(`${this.ENDPOINT}/${id}`);
  },
  update(id: Id, data: DraftWord) {
    return ApiTransport.put<Word>(`${this.ENDPOINT}/${id}`, data);
  },
  delete(id: Id) {
    return ApiTransport.remove<void>(`${this.ENDPOINT}/${id}`);
  },
};
