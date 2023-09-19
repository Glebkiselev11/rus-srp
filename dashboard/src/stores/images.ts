import type { RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { ImagesApi } from "@/api";
import type { Image } from "@/types/images";

export const useImagesStore = defineStore("images", {
	state: () => ({
		images: [] as Array<Image>,
		count: 0,
		loading: false,
	}),
	actions: {
		async fetchImages(params: RequestParams) {
			try {
				this.loading = true;

				const { data } = await ImagesApi.query(params);
				this.images = data.result;
				this.count = data.count;
			} catch (error) {
				console.error(error);
				alert(error);
			} finally {	
				this.loading = false;
			}
		},

		clearImages() {
			this.images = [];
			this.count = 0;
		},
	},
});
