<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { vInfiniteScroll } from "@vueuse/components";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import { useImagesInfinityQuery } from "@/queries/images";
import { InputComp } from "@/shared/ui/Input";
import { IconComp } from "@/shared/ui/Icon";
import { ButtonComp } from "@/shared/ui/Button";
import { ZeroStateComp } from "@/shared/ui/ZeroState";
import SkeletonItemComp from "./SkeletonItemComp.vue";

const { t } = useI18n();

type Props = {
  savedLink: string | null;
  defaultSearchQuery: string;
};

const props = withDefaults(defineProps<Props>(), {
  savedLink: null,
  defaultSearchQuery: "",
});

const emit = defineEmits<{
  (event: "select", src: string): void;
}>();

const searchQuery = ref(props.defaultSearchQuery);
const limit = 50;

const requestParams = computed(() => ({
  search: searchQuery.value,
  limit,
}));

const { data, status, fetchNextPage, isFetchingNextPage } =
  useImagesInfinityQuery(requestParams);

const images = computed(() => {
  return data.value?.pages.flatMap((page) => page.images) ?? [];
});

const filteredImages = computed(() => {
  return images.value.filter(({ src }) => src !== props.savedLink);
});

const nothingWereFound = computed(() => {
  return (
    !images.value.length &&
    (!props.savedLink || searchQuery.value !== props.defaultSearchQuery)
  );
});

const areImagesContainSavedLink = computed(() => {
  return images.value.some(({ src }) => src === props.savedLink);
});

function selectImage(src: string) {
  emit("select", src);
}
</script>

<template>
  <div class="image-search">
    <InputComp
      v-model="searchQuery"
      width="100%"
      type="text"
      left-icon="search"
      :placeholder="t('find-image')"
      class="image-search--input"
      debounce
      clear-button
    />

    <section
      v-infinite-scroll="[fetchNextPage, { distance: 10 }]"
      class="image-search-list"
    >
      <!-- Search query is empty -->
      <ZeroStateComp
        v-if="!searchQuery"
        icon="manage_search"
        :title="t('image-search-title')"
        :description="t('image-search-description')"
      />

      <!-- Nothing were found -->
      <ZeroStateComp
        v-if="status === 'success' && nothingWereFound"
        icon="search"
        :title="t('not-found', { search: searchQuery })"
        :description="t('not-found-description')"
      >
        <ButtonComp
          icon="search"
          :label="t('search-by-query', { query: defaultSearchQuery })"
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
          {{ t("selected") }}
        </div>
      </div>

      <img
        v-for="image in filteredImages"
        :key="image.id"
        class="image-search-list--image"
        :src="addCropImagaeParamsToUrl(image.src, 300)"
        @click="selectImage(image.src)"
      />

      <template v-if="status === 'pending' || isFetchingNextPage">
        <div v-for="i in limit" :key="i" class="image-search-list--image">
          <SkeletonItemComp />
        </div>
      </template>
    </section>
  </div>
</template>

<style lang="scss" scoped>
$image-size: 224.5px;

.image-search {
  inline-size: 986px;
  padding-inline-start: 20px;
  padding-block-start: 4px;
  overflow: hidden;
  border-radius: inherit;

  &--input {
    padding-inline-end: 20px;
  }
}

.image-search-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
  padding-block-start: 20px;
  block-size: 70vh;
  overflow: auto;

  &--image {
    width: $image-size;
    height: $image-size;
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    border: 1px solid $color-image-border;
  }
}

.selected-image {
  position: relative;
  max-height: $image-size;

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
