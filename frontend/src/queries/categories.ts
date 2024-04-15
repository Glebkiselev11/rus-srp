import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { CategoriesService } from "@/api/services/categories";
import type { Id, RequestParams } from "@/types/api";
import { computed, type Ref } from "vue";
import type { Category, DraftCategory } from "@/types/categories";

const KEY = "categories";

export const useCategoriesQuery = (params: Ref<RequestParams>) => {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => CategoriesService.query(params.value),
  });
};

export const useCategoryByIdQuery = (id: Ref<Id | undefined>) => {
  const queryClient = useQueryClient();
  const enabled = computed(() => !!id.value);

  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => {
      const data = queryClient
        .getQueryCache()
        .getAll()
        .find((query) => query.queryKey[0] === KEY)?.state.data;

      if (data) {
        const { categories } = data as { categories: Category[] };
        const category = categories.find((c) => c.id === id.value);
        if (category) {
          return { category }; // Return the cached category if found
        }
      }

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
