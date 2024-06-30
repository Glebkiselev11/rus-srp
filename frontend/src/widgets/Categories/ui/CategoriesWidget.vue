<!-- The side bar with categories -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { Id, Order, RequestParams } from "@/types/api";
import type { LanguageCode } from "@/shared/Translate";
import type { Category } from "@/entities/Category";
import { useDraftCategoryStore } from "@/stores/draftCategory";
import { ButtonComp } from "@/shared/ui/Button";
import CategorySearchInputComp from "@/components/CategorySearchInputComp.vue";
import CategoriesListComp from "./CategoriesListComp.vue";
import { HeaderComp } from "@/shared/ui/Header";
import { DropdownMenuComp } from "@/shared/ui/DropdownMenu";
import { TooltipComp } from "@/shared/ui/Tooltip";
import CategoryFormModalComp from "@/components/CategoryForm/CategoryFormModalComp.vue";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const draftCategoryStore = useDraftCategoryStore();

const props = defineProps<{
  selectedCategoryId?: Id;
}>();

const emit = defineEmits<{
  (e: "update:selected-category-id", catedoryId: Id): void;
  (e: "created-category", categoryId: Id): void;
}>();

const showCategoryForm = ref(false);

const filter = computed({
  get(): RequestParams {
    return {
      search: (route.query.search_category as string) || "",
      order: (route.query.order_category as Order) || "-created_at",
      offset: 0,
      limit: 9999,
    };
  },
  set(params: RequestParams) {
    router.push({
      query: {
        ...route.query,
        search_category: params.search,
        order_category: params.order,
      },
    });
  },
});

const order = computed({
  get() {
    return filter.value.order as Order;
  },
  set(order: Order) {
    filter.value = { ...filter.value, order };
  },
});

const search = computed({
  get(): string {
    return filter.value.search;
  },
  set(search: string) {
    filter.value = { ...filter.value, search };
  },
});

const orderOptions = computed(() => {
  return [
    {
      label: t("order.last-added"),
      icon: "done",
      iconColor: getOrderColor("-created_at"),
      handler: () => (order.value = "-created_at"),
    } as const,
    {
      label: t("order.last-updated"),
      iconColor: getOrderColor("-updated_at"),
      icon: "done",
      handler: () => (order.value = "-updated_at"),
    } as const,
    "separator" as const,
    {
      label: t("order.alphabetical-asc"),
      iconColor: getOrderColor(`${locale.value as LanguageCode}`),
      icon: "done",
      handler: () => (order.value = `${locale.value as LanguageCode}`),
    } as const,
    {
      label: t("order.alphabetical-desc"),
      iconColor: getOrderColor(`-${locale.value as LanguageCode}`),
      icon: "done",
      handler: () => (order.value = `-${locale.value as LanguageCode}`),
    } as const,
  ];
});

function getOrderColor(key: Order) {
  return key === order.value ? "accent-primary" : "transparent";
}

function selectCategory(categoryId: Id) {
  emit("update:selected-category-id", categoryId);
}

function createdCategory(categoryId: Id) {
  emit("created-category", categoryId);
}

function openEditingCategoryForm(category: Category) {
  draftCategoryStore.initDraftCategory(category);
  showCategoryForm.value = true;
}

function openCreationCategoryForm() {
  draftCategoryStore.initDraftCategory();
  showCategoryForm.value = true;
}
</script>

<template>
  <div class="categories">
    <HeaderComp :title="t('categories')" title-tag="h4" padding-inline="12px">
      <template #right>
        <div class="categories__controls">
          <DropdownMenuComp :items="orderOptions" position="right">
            <template #trigger="{ isMenuOpen }">
              <TooltipComp :text="t('to-sort')" :hidden="isMenuOpen">
                <ButtonComp
                  icon="sort"
                  appearance="inline"
                  color="neutral"
                  :pressed="isMenuOpen"
                />
              </TooltipComp>
            </template>
          </DropdownMenuComp>

          <TooltipComp :text="t('create-category')">
            <ButtonComp
              icon="add"
              appearance="inline"
              color="neutral"
              @click="openCreationCategoryForm"
            />
          </TooltipComp>
        </div>
      </template>
    </HeaderComp>

    <CategorySearchInputComp
      class="categories__search"
      :search="search"
      appearance="default"
      :search-placeholder="t('find-category')"
      width="100%"
      @update:search="search = $event"
      @created-category="createdCategory"
    />

    <CategoriesListComp
      :selected-category-id="props.selectedCategoryId"
      :request-params="filter"
      @select-cateogry="selectCategory"
      @select-category-for-editing="openEditingCategoryForm"
    />

    <CategoryFormModalComp
      v-if="showCategoryForm"
      @close="showCategoryForm = false"
      @created="createdCategory"
    />
  </div>
</template>

<style scoped lang="scss">
.categories {
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;

  &__controls {
    display: flex;
  }

  &__search {
    padding-inline: 12px;
  }
}
</style>
