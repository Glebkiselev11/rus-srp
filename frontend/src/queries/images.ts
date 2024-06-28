import { useInfiniteQuery } from "@tanstack/vue-query";
import type { RequestParams } from "@/types/api";
import type { Ref } from "vue";
import { ImagesService } from "@/shared/api";
import type { Image } from "@/types/images";

export const KEY = "images";

export const useImagesInfinityQuery = (params: Ref<RequestParams>) => {
  return useInfiniteQuery({
    queryKey: [KEY, params],
    staleTime: Infinity,
    queryFn: (p) =>
      ImagesService.query({
        ...params.value,
        offset: p.pageParam * params.value.limit,
      }),
    getNextPageParam: (
      lastPage: { images: Image[]; count: number; offset: number },
      _allPages,
      lastPageParam: number
    ) => {
      if (lastPage.images.length === 0) {
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
