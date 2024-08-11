import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { WordsService, KEY as WORD_KEY } from "@/entities/Word";
import { KEY as CATEGORY_KEY } from "@/entities/Category";
import type { Id } from "@/shared/types";

export const useDeleteWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id) => WordsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORD_KEY] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
    },
  });
};
