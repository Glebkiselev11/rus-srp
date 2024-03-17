import type { Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { ImagesApi } from "@/api";
import type { Image } from "@/types/images";

export const useImagesStore = defineStore("images", {
  state: () => ({
    images: [] as Array<Image>,
    count: 0,
    loadState: "initial" as Load,
  }),
  actions: {
    async fetchImages(params: RequestParams) {
      try {
        this.loadState = "loading";

        const { data } = await ImagesApi.query(params);
        this.images = [...this.images, ...data.result];
        this.count = data.count;
        this.loadState = "loaded";
      } catch (error) {
        console.error(error);
        this.loadState = "error";
      }
    },

    clearImages() {
      this.images = [];
      this.count = 0;
    },
  },
});
