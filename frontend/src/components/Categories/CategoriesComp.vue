<!-- The side bar with categories -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { Id, Order, RequestParams } from "@/types/api";
import type { LanguageCode } from "@/types/translations";
import { usePageCategoriesStore } from "@/stores/categories/pageCategories";
import ButtonComp from "@/components/ButtonComp.vue";
import InputComp from "@/components/InputComp.vue";
import CategoriesListComp from "@/components/Categories/CategoriesListComp.vue";
import HeaderComp from "@/components/HeaderComp.vue";
import DropdownMenuComp from "../DropdownMenuComp.vue";
import TooltipComp from "../TooltipComp.vue";
import CategoryFormModalComp from "@/components/CategoryForm/CategoryFormModalComp.vue";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const pageCategoriesStore = usePageCategoriesStore();

const props = defineProps<{
  selectedCategoryId?: Id;
}>();

const emit = defineEmits<{
  (e: "update:selected-category-id", catedoryId: Id): void;
}>();

const showCategoryForm = ref(false);
const editingCategoryId = ref<Id | undefined>(undefined);

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
    console.log(params);
    router
      .push({
        query: {
          ...route.query,
          search_category: params.search,
          order_category: params.order,
        },
      })
      .then(() => {
        pageCategoriesStore.fetchPageCategories(params);
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

onMounted(() => {
  pageCategoriesStore.fetchPageCategories(filter.value);
});

function getOrderColor(key: Order) {
  return key === order.value ? "accent-primary" : "transparent";
}

function selectCategory(categoryId: Id) {
  emit("update:selected-category-id", categoryId);
}

function openEditingCategoryForm(categoryId: Id) {
  editingCategoryId.value = categoryId;
  showCategoryForm.value = true;
}

function openCreationCategoryForm() {
  editingCategoryId.value = undefined;
  showCategoryForm.value = true;
}
</script>

<template>
  <div class="categories">
    <HeaderComp :title="t('categories')" title-tag="h4" padding-inline="12px">
      <template #right>
        <div class="categories__controls">
          <DropdownMenuComp
            v-slot="{ isMenuOpen }"
            :items="orderOptions"
            position="right"
          >
            <TooltipComp :text="t('to-sort')" :hidden="isMenuOpen">
              <ButtonComp
                icon="sort"
                appearance="inline"
                color="neutral"
                :pressed="isMenuOpen"
              />
            </TooltipComp>
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

    <InputComp
      v-model="search"
      :placeholder="t('find-category')"
      left-icon="search"
      debounce
      clear-button
      class="categories__search"
    />

    <CategoriesListComp
      :selected-category-id="props.selectedCategoryId"
      :search-quary="search"
      @select-cateogry="selectCategory"
      @select-category-for-editing="openEditingCategoryForm"
    />

    <CategoryFormModalComp
      v-if="showCategoryForm"
      :category-id="editingCategoryId"
      @close="showCategoryForm = false"
      @created="selectCategory"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

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
