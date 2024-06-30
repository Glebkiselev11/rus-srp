import type { Id } from "@/types/api";
import { ApiTransport } from "@/shared/api";

export const deleteWordsFromCategory = async (id: Id, word_ids: Id[]) => {
  return await ApiTransport.remove<void>(
    `/api/v1/private/categories/${id}/delete-words`,
    {
      word_ids,
    }
  );
};
