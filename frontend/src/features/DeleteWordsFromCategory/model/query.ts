import type { Id } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { KEY as CATEGORY_KEY } from "@/entities/Category";
import { KEY as WORD_KEY } from "@/entities/Word";
import { deleteWordsFromCategory } from "../api";

export const useDeleteWordsFromCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: Id; word_ids: Id[] }) =>
      deleteWordsFromCategory(params.id, params.word_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WORD_KEY] });
    },
  });
};
