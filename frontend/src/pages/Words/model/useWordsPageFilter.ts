import type {
  Id,
  Order,
  RequestParams,
  TranslationApprovedStatus,
} from "@/shared/types";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useWordsPageFilter = () => {
  const LIMIT_DEFAULT = 25;

  const DEFAULT_FILTER = {
    search: "",
    offset: 0,
    limit: LIMIT_DEFAULT,
    order: "-created_at" as Order,
    category_id: undefined,
    translation_approved_status: "all" as TranslationApprovedStatus,
  };
  const route = useRoute();
  const router = useRouter();

  const filter = computed({
    get(): RequestParams {
      const {
        search,
        offset,
        limit,
        order,
        category_id,
        translation_approved_status,
      } = DEFAULT_FILTER;
      return {
        search: (route.query.search_word as string) || search,
        offset: Number(route.query.offset) || offset,
        limit: Number(route.query.limit) || limit,
        order: (route.query.order_word as Order) || order,
        category_id: Number(route.query.category_id) || category_id,
        translation_approved_status:
          (route.query
            .translation_approved_status as TranslationApprovedStatus) ||
          translation_approved_status,
      };
    },
    set(params: RequestParams) {
      router.push({
        query: {
          ...route.query,
          search_word: params.search,
          offset: params.offset,
          limit: params.limit,
          order_word: params.order,
          category_id: params.category_id,
          translation_approved_status: params.translation_approved_status,
        },
      });
    },
  });
  const category_id = computed({
    get(): Id | undefined {
      return filter.value.category_id;
    },
    set(category_id: Id | undefined) {
      filter.value = { ...filter.value, category_id };
    },
  });

  const search = computed({
    get(): string {
      return filter.value.search ?? "";
    },
    set(search: string) {
      const { offset } = DEFAULT_FILTER;
      filter.value = {
        ...filter.value,
        search,

        // reset pagination filters
        offset,
      };
    },
  });

  const limit = computed({
    get(): number {
      return filter.value.limit;
    },
    set(limit: number) {
      filter.value = { ...filter.value, limit, offset: 0 };
    },
  });

  const offset = computed({
    get(): number {
      return filter.value.offset || 0;
    },
    set(offset: number) {
      filter.value = { ...filter.value, offset };
    },
  });

  const order = computed({
    get(): Order {
      return filter.value.order || "-created_at";
    },
    set(order: Order) {
      filter.value = { ...filter.value, order };
    },
  });

  const translation_approved_status = computed({
    get(): TranslationApprovedStatus {
      return filter.value.translation_approved_status || "all";
    },
    set(translation_approved_status: TranslationApprovedStatus) {
      const { offset } = DEFAULT_FILTER;
      filter.value = {
        ...filter.value,
        translation_approved_status,
        offset,
      };
    },
  });

  return {
    filter,
    category_id,
    search,
    limit,
    offset,
    order,
    translation_approved_status,
    DEFAULT_FILTER,
    LIMIT_DEFAULT,
  };
};
