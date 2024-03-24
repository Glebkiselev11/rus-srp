<script lang="ts">
import { defineComponent, type PropType } from "vue";
import InputComp from "./InputComp.vue";
import IconComp from "./IconComp/index.vue";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import { useImagesStore } from "@/stores/images";
import { mapActions, mapState } from "pinia";
import type { RequestParams } from "@/types/api";
import { vInfiniteScroll } from "@vueuse/components";
import ButtonComp from "./ButtonComp.vue";
import ZeroStateComp from "./ZeroStateComp.vue";
import SkeletonItemComp from "./SkeletonItemComp.vue";

export default defineComponent({
  name: "ImagesSearchComp",
  components: {
    InputComp,
    IconComp,
    ButtonComp,
    ZeroStateComp,
    SkeletonItemComp,
  },
  directives: {
    infiniteScroll: vInfiniteScroll,
  },
  props: {
    savedLink: {
      type: [String, null] as PropType<string | null>,
      default: null,
    },
    defaultSearchQuery: {
      type: String,
      default: "",
    },
  },
  emits: ["select"],
  data() {
    return {
      searchQuery: this.defaultSearchQuery,
      offset: 0,
      limit: 50,
    };
  },
  computed: {
    ...mapState(useImagesStore, ["images", "count", "loadState"]),
    requestParams(): RequestParams {
      return {
        search: this.searchQuery,
        offset: this.offset,
        limit: this.limit,
      };
    },
    filteredImages() {
      return this.images.filter(({ src }) => src !== this.savedLink);
    },
    areImagesContainSavedLink(): boolean {
      return this.images.some(({ src }) => src === this.savedLink);
    },
    canLoadMore(): boolean {
      return this.loadState === "loading" || this.offset >= this.count;
    },
  },
  watch: {
    searchQuery() {
      this.offset = 0;
      this.clearImages();
      if (!this.searchQuery) return;

      this.fetchImages(this.requestParams);
    },
  },
  created() {
    if (this.searchQuery) {
      this.fetchImages(this.requestParams);
    }
  },
  beforeUnmount() {
    this.clearImages();
  },
  methods: {
    ...mapActions(useImagesStore, ["fetchImages", "clearImages"]),
    addCropImagaeParamsToUrl,
    selectImage(src: string) {
      this.$emit("select", src);
    },
    loadMore() {
      if (this.loadState === "loading") return;
      this.offset += this.limit;

      if (this.offset >= this.count) return;
      this.fetchImages(this.requestParams);
    },
  },
});
</script>

<template>
  <div class="image-search">
    <InputComp
      v-model="searchQuery"
      width="100%"
      type="text"
      left-icon="search"
      class="image-search--input"
      debounce
      clear-button
    />

    <section
      v-infinite-scroll="[loadMore, { distance: 10 }]"
      class="image-search-list"
    >
      <!-- Search query is empty -->
      <ZeroStateComp
        v-if="loadState === 'initial' && !searchQuery"
        icon="manage_search"
        :title="$t('image-search-title')"
        :description="$t('image-search-description')"
      />

      <!-- Nothing were found -->
      <ZeroStateComp
        v-if="loadState === 'loaded' && !images.length"
        icon="search"
        :title="$t('not-found', { search: searchQuery })"
        :description="$t('not-found-description')"
      >
        <ButtonComp
          icon="search"
          :label="$t('search-by-query', { query: defaultSearchQuery })"
          @click="searchQuery = defaultSearchQuery"
        />
      </ZeroStateComp>

      <div v-if="savedLink && areImagesContainSavedLink" class="selected-image">
        <img
          class="image-search-list--image"
          :src="addCropImagaeParamsToUrl(savedLink, 300)"
        />

        <div class="selected-image--badge">
          <IconComp name="check_circle" color="accent-primary" />
          {{ $t("selected") }}
        </div>
      </div>

      <img
        v-for="image in filteredImages"
        :key="image.id"
        class="image-search-list--image"
        :src="addCropImagaeParamsToUrl(image.src, 300)"
        @click="selectImage(image.src)"
      />

      <template v-if="loadState === 'loading'">
        <div v-for="i in limit" :key="i" class="image-search-list--image">
          <SkeletonItemComp />
        </div>
      </template>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.image-search {
  inline-size: 946px;
  padding-inline-start: 12px;
  padding-block-start: 4px;
  overflow: hidden;
  border-radius: inherit;

  &--input {
    padding-inline-end: 12px;
  }
}

.image-search-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-block-start: 20px;
  block-size: 70vh;
  overflow: auto;

  &--image {
    width: 218px;
    height: 218px;
    object-fit: cover;
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid $color-image-border;
  }
}

.selected-image {
  position: relative;

  &--badge {
    @include text-caption-2;

    position: absolute;
    height: 28px;
    inset-block-start: 8px;
    inset-inline-end: 8px;
    border-radius: 8px;
    padding-inline: 8px 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: $color-background-content-primary;
  }

  img {
    border: 2px solid $color-stroke-accent;
  }
}
</style>
