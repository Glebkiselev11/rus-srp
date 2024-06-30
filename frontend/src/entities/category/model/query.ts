import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { CategoriesService } from "../api";
import type { Id, RequestParams } from "@/types/api";
import { computed, type Ref } from "vue";
import type { Category, DraftCategory } from "./types";
import { KEY as WORD_KEY } from "@/entities/word";

export const KEY = "categories";

export const useCategoriesQuery = (params: Ref<RequestParams>) => {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => CategoriesService.query(params.value),
  });
};

export const useCategoryByIdQuery = (id: Ref<Id | undefined>) => {
  const enabled = computed(() => !!id.value);

  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return CategoriesService.getById(id.value!);
    },
    enabled,
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: (DraftCategory & { id: Id }) | Category) =>
      CategoriesService.update(category.id, category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: DraftCategory) => CategoriesService.create(category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id) => CategoriesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};
// TODO: move into features
export const useDeleteWordsFromCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: Id; word_ids: Id[] }) =>
      CategoriesService.deleteWords(params.id, params.word_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      queryClient.invalidateQueries({ queryKey: [WORD_KEY] });
    },
  });
};
