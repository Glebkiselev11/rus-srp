<script lang="ts"></script>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { useTranslations } from "@/common/useTranslations";
import { useCategoryByIdQuery, useUpdateCategory } from "@/queries/categories";
import type { Id } from "@/types/api";
import type { Category } from "@/types/categories";
import ImagePreviewComp from "./ImagePreviewComp.vue";
import DropdownMenuComp from "./DropdownMenuComp.vue";
import ButtonComp from "./ButtonComp.vue";
import RemoveCategoryModalComp from "./Categories/RemoveCategoryModalComp.vue";
import CategoryFormModalComp from "@/components/CategoryForm/CategoryFormModalComp.vue";
import AllWordsCategoryImageComp from "./Categories/AllWordsCategoryImageComp.vue";

const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslations();

const props = defineProps<{
  categoryId?: Id;
}>();

const isRemoveCategoryModalOpen = ref(false);
const isEditCategoryModalOpen = ref(false);

const { data } = useCategoryByIdQuery(toRef(props, "categoryId"));
const updateCategory = useUpdateCategory();

function editCategory() {
  isEditCategoryModalOpen.value = true;
}

function openRemoveCategoryModal() {
  isRemoveCategoryModalOpen.value = true;
}

function updateCategoryImage(src: string) {
  if (data && data.value?.category && src) {
    updateCategory.mutate({
      ...data.value.category,
      image: src,
    } as Category);
  }
}
</script>

<template>
  <div v-if="categoryId && data?.category" class="words-page-category-title">
    <ImagePreviewComp
      size="56px"
      :src="data.category.image"
      :image-search-modal-subtitle="
        extractCurrentLanguageTranslation(data.category)
      "
      :default-image-search-query="data.category.eng"
      @update:src="(src) => updateCategoryImage(src)"
    />
    <h2>
      {{ extractCurrentLanguageTranslation(data.category) }}
    </h2>

    <DropdownMenuComp
      v-slot="{ isMenuOpen }"
      :items="[
        {
          label: t('edit'),
          icon: 'edit',
          handler: editCategory,
        },
        'separator',
        {
          label: t('delete'),
          icon: 'delete',
          color: 'negative',
          handler: openRemoveCategoryModal,
        },
      ]"
    >
      <ButtonComp
        icon="more_vert"
        appearance="inline"
        color="neutral"
        size="compact"
        class="words-page-category-title__menu-button"
        :pressed="isMenuOpen"
      />
    </DropdownMenuComp>

    <RemoveCategoryModalComp
      v-if="isRemoveCategoryModalOpen"
      :category="data.category"
      @close="isRemoveCategoryModalOpen = false"
    />

    <CategoryFormModalComp
      v-if="isEditCategoryModalOpen"
      :category-id="data.category.id"
      @close="isEditCategoryModalOpen = false"
    />
  </div>

  <div v-else-if="!categoryId" class="words-page-category-title">
    <AllWordsCategoryImageComp size="56px" />
    <h2>
      {{ t("all-words") }}
    </h2>
  </div>
</template>

<style scoped lang="scss">
.words-page-category-title {
  display: flex;
  align-items: center;
  gap: 12px;

  & > h2::first-letter {
    text-transform: uppercase;
  }

  &__menu-button {
    visibility: hidden;
  }
}

.words-page-category-title:hover,
.dropdown--open {
  .words-page-category-title__menu-button {
    visibility: visible;
  }
}
</style>
