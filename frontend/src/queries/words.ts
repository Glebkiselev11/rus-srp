import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { DraftWord, Word } from "@/types/words";
import { WordsService } from "@/api/services/words";
import type { Id, RequestParams } from "@/types/api";
import type { Ref } from "vue";

const KEY = "words";

export const useWordsQuery = (params: Ref<RequestParams>) => {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => WordsService.query_v2(params.value),
    enabled: true,
  });
};

export const useUpdateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: (DraftWord & { id: Id }) | Word) =>
      WordsService.update(word.id, word),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useCreateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: DraftWord) => WordsService.create(word),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useDeleteWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id) => WordsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};
