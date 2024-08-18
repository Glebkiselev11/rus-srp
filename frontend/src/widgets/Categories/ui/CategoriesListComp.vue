<script setup lang="ts">
import type { Id, RequestParams } from "@/shared/types";
import CategoryItemComp from "./CategoryItemComp.vue";
import { ListItemComp } from "@/shared/ui/ListItem";
import { LogoComp } from "@/shared/ui/Logo";
import { ZeroStateComp } from "@/shared/ui/ZeroState";
import { SkeletonItemComp } from "@/shared/ui/SkeletonItem";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { toReactive } from "@vueuse/core";
import { type Category, useCategoriesQuery } from "@/entities/Category";
import { useWordsCountQuery } from "@/entities/Word";

const { t } = useI18n();

const props = defineProps<{
  selectedCategoryId?: Id;
  requestParams: RequestParams;
}>();

const emit = defineEmits<{
  (e: "selectCateogry", catedoryId: Id): void;
  (e: "select-category-for-editing", catedory: Category): void;
}>();

const filter = computed(() => toReactive(props.requestParams));
const { data, status } = useCategoriesQuery(filter);
const { data: wordsCount } = useWordsCountQuery();

function selectCategory(categoryId: Id) {
  if (categoryId === props.selectedCategoryId) return;
  emit("selectCateogry", categoryId);
}

function selectCategoryForEditing(category: Category) {
  emit("select-category-for-editing", category);
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
          <LogoComp size="24px" />

          <span>{{ t("all-words") }}</span>
          <span class="all-words-count" v-text="wordsCount" />
        </div>
      </ListItemComp>
    </div>

    <hr />

    <div
      v-if="status === 'success' && data && data.count > 0"
      class="categories-list__items"
    >
      <CategoryItemComp
        v-for="category in data.categories"
        :key="category.id"
        :category="category"
        :selected="category.id === selectedCategoryId"
        :query="props.requestParams.search"
        @select-cateogry="selectCategory"
        @select-category-for-editing="selectCategoryForEditing"
      />
    </div>

    <div v-else-if="status === 'pending'" class="categories-list__items">
      <div v-for="i in 15" :key="i" class="categories-list__skeleton-item">
        <SkeletonItemComp height="24px" width="24px" border-radius="8px" />
        <SkeletonItemComp height="20px" random-width border-radius="4px" />
      </div>
    </div>

    <div
      v-else-if="status === 'success' && data?.count === 0"
      class="categories-list__zero-state"
    >
      <ZeroStateComp
        icon="search"
        :title="t('not-found')"
        :description="t('not-found-description')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.categories-list {
  &__all-words-item {
    display: flex;
    align-items: center;
    column-gap: 8px;

    @include text-body-2;

    .all-words-count {
      color: $color-text-tertiary;
    }
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
