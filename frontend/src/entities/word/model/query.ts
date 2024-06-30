import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import type { DraftWord, Word } from "./types";
import { WordsService } from "../api";
import type { Id, RequestParams } from "@/shared/types";
import type { Ref } from "vue";

export const KEY = "words";

export const useWordsQuery = (params: Ref<RequestParams>) => {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => WordsService.query(params.value),
  });
};

export const useWordsInfinityQuery = (params: Ref<RequestParams>) => {
  return useInfiniteQuery({
    queryKey: [KEY, params],
    staleTime: Infinity,
    queryFn: (p) =>
      WordsService.query({
        ...params.value,
        offset: p.pageParam * params.value.limit,
      }),
    getNextPageParam: (
      lastPage: { words: Word[]; count: number; offset: number },
      _allPages,
      lastPageParam: number
    ) => {
      if (lastPage.words.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam: number) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    initialPageParam: 0,
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
