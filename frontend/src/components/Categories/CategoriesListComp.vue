<script setup lang="ts">
import type { Id } from "@/types/api";
import { usePageCategoriesStore } from "@/stores/categories/pageCategories";
import CategoryItemComp from "./CategoryItemComp.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import AllWordsCategoryImageComp from "./AllWordsCategoryImageComp.vue";
import ZeroStateComp from "../ZeroStateComp.vue";
import SkeletonItemComp from "../SkeletonItemComp.vue";

const pageCategoriesStore = usePageCategoriesStore();

const props = defineProps<{
  selectedCategoryId?: Id;
  searchQuary?: string;
}>();

const emit = defineEmits<{
  (e: "selectCateogry", catedoryId: Id): void;
  (e: "select-category-for-editing", catedoryId: Id): void;
}>();

function selectCategory(categoryId: Id) {
  if (categoryId === props.selectedCategoryId) return;
  emit("selectCateogry", categoryId);
}

function selectCategoryForEditing(categoryId: Id) {
  emit("select-category-for-editing", categoryId);
}
</script>

<template>
  <div class="categories-list">
    <div class="categories-list__items">
      <ListItemComp
        clickable
        size="compact"
        :selected="!selectedCategoryId"
        padding-inline="8px"
        @click="selectCategory(0)"
      >
        <div class="categories-list__all-words-item">
          <AllWordsCategoryImageComp size="24px" />

          <span>{{ $t("all-words") }}</span>
        </div>
      </ListItemComp>
    </div>

    <hr />

    <div
      v-if="
        pageCategoriesStore.loadState === 'loaded' &&
        pageCategoriesStore.count > 0
      "
      class="categories-list__items"
    >
      <CategoryItemComp
        v-for="category in pageCategoriesStore.categories"
        :key="category.id"
        :category="category"
        :selected="category.id === selectedCategoryId"
        :query="searchQuary"
        @select-cateogry="selectCategory"
        @select-category-for-editing="selectCategoryForEditing"
      />
    </div>

    <div
      v-else-if="pageCategoriesStore.loadState === 'loading'"
      class="categories-list__items"
    >
      <div v-for="i in 15" :key="i" class="categories-list__skeleton-item">
        <SkeletonItemComp height="24px" width="24px" border-radius="8px" />
        <SkeletonItemComp height="20px" random-width border-radius="4px" />
      </div>
    </div>

    <div
      v-else-if="
        pageCategoriesStore.loadState === 'loaded' &&
        pageCategoriesStore.count === 0
      "
      class="categories-list__zero-state"
    >
      <ZeroStateComp
        icon="search"
        :title="$t('not-found')"
        :description="$t('not-found-description')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.categories-list {
  &__all-words-item {
    display: flex;
    align-items: center;
    column-gap: 8px;

    @include text-body-2;
  }

  &__items {
    padding: 12px;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    max-height: calc(100vh - 170px);
    overflow: auto;
  }

  &__skeleton-item {
    display: flex;
    align-items: center;
    column-gap: 8px;
    padding: 8px;
  }

  &__zero-state {
    @extend .categories-list__items;

    margin-block: 75%;
  }
}
</style>
