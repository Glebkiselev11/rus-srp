<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDraftWordStore } from "@/stores/draftWord";
import type { Category } from "@/types/categories";
import type { Id, Order } from "@/types/api";
import CategorySearchInputComp from "@/components/CategorySearchInputComp.vue";
import { ButtonComp } from "@/shared/ui/Button";
import CategoryFormModalComp from "@/components/CategoryForm/CategoryFormModalComp.vue";
import WordFormCategoryItemComp from "./WordFormCategoryItemComp.vue";
import { IconComp } from "@/shared/ui/Icon";
import TooltipComp from "../TooltipComp.vue";
import ZeroStateComp from "../ZeroStateComp.vue";
import { useCategoriesQuery } from "@/queries/categories";

const { t } = useI18n();
const draftWordStore = useDraftWordStore();

const showCategoryForm = ref(false);
const search = ref("");

const filter = computed(() => {
  return {
    search: search.value,
    order: "-created_at" as Order,
    offset: 0,
    limit: 1000,
  };
});

const { data, isFetched } = useCategoriesQuery(filter);

const categories = computed(() => {
  return data.value?.categories || [];
});

const addedCategories = computed(() => {
  return draftWordStore.draftWord.category_ids
    .map((id) => categories.value.find((x) => x.id === id))
    .filter(Boolean) as Category[];
});

const nonAddedCategories = computed(() => {
  return categories.value.filter(
    (x) => !draftWordStore.draftWord.category_ids.includes(x.id)
  );
});

const nothingWereFound = computed(() => {
  return (
    isFetched.value &&
    !addedCategories.value.length &&
    !nonAddedCategories.value.length
  );
});

function removeCategory(categoryId: Id) {
  draftWordStore.draftWord.category_ids =
    draftWordStore.draftWord.category_ids.filter((x) => x !== categoryId);
}

function addCategory(categoryId: Id) {
  draftWordStore.draftWord.category_ids.push(categoryId);
}
</script>

<template>
  <div class="word-form-categories">
    <div class="word-form-categories__row">
      <CategorySearchInputComp
        class="word-form-categories__search-input"
        :search="search"
        appearance="outline"
        :search-placeholder="t('find-category')"
        width="100%"
        @update:search="search = $event"
      />

      <ButtonComp
        icon="add"
        class="word-form-categories__create-category-button"
        appearance="inline"
        :label="t('create-category')"
        @click="showCategoryForm = true"
      />
    </div>

    <!-- Nothing were found -->
    <ZeroStateComp
      v-if="nothingWereFound"
      icon="search"
      :title="t('not-found', { search })"
      :description="t('not-found-description')"
      class="word-form-categories__zero-state"
    />

    <template v-else>
      <div class="word-form-categories__list">
        <WordFormCategoryItemComp
          v-for="category in addedCategories"
          :key="category.id"
          :query="search"
          :category="category"
          @select-cateogry="removeCategory"
        >
          <TooltipComp :text="t('remove-from-category')" position="left">
            <IconComp name="remove" size="compact" appearance="inline" />
          </TooltipComp>
        </WordFormCategoryItemComp>
      </div>

      <span class="word-form-categories__caption">{{
        t("all-categories")
      }}</span>

      <div class="word-form-categories__list">
        <WordFormCategoryItemComp
          v-for="category in nonAddedCategories"
          :key="category.id"
          :query="search"
          :category="category"
          @select-cateogry="addCategory"
        >
          <TooltipComp :text="t('add-to-category')" position="left">
            <IconComp name="add" size="compact" appearance="inline" />
          </TooltipComp>
        </WordFormCategoryItemComp>
      </div>
    </template>

    <CategoryFormModalComp
      v-if="showCategoryForm"
      @close="showCategoryForm = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.word-form-categories {
  &__row {
    display: flex;
    justify-content: space-between;
    column-gap: 8px;
  }

  &__search-input {
    flex-shrink: 1;
  }

  &__create-category-button {
    margin-inline-start: 16px;
    flex-shrink: 0;
  }

  &__caption {
    @include text-caption-1;

    color: $color-text-secondary;
    margin-inline-start: 8px;
  }

  &__list {
    margin-block: 16px 24px;
  }

  &__zero-state {
    margin-block-start: 160px;
  }
}
</style>
