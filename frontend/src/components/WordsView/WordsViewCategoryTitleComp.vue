<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTranslations } from "@/common/useTranslations";
import { useUpdateCategory } from "@/queries/categories";
import type { Category } from "@/types/categories";
import ImagePreviewComp from "../ImagePreviewComp.vue";
import DropdownMenuComp from "../DropdownMenuComp.vue";
import ButtonComp from "../ButtonComp.vue";
import RemoveCategoryModalComp from "../Categories/RemoveCategoryModalComp.vue";
import CategoryFormModalComp from "@/components/CategoryForm/CategoryFormModalComp.vue";
import AllWordsCategoryImageComp from "../Categories/AllWordsCategoryImageComp.vue";
import { useToasterStore } from "@/stores/toaster";

const toastStore = useToasterStore();
const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslations();

const props = defineProps<{
  category?: Category;
}>();

const isRemoveCategoryModalOpen = ref(false);
const isEditCategoryModalOpen = ref(false);

const updateCategory = useUpdateCategory();

function editCategory() {
  isEditCategoryModalOpen.value = true;
}

function openRemoveCategoryModal() {
  isRemoveCategoryModalOpen.value = true;
}

function updateCategoryImage(src: string) {
  if (props.category && src) {
    updateCategory.mutate({
      ...props.category,
      image: src,
    } as Category);

    toastStore.addToast({
      type: "success",
      message: t("changes-saved"),
    });
  }
}
</script>

<template>
  <div v-if="props.category" class="words-view-category-title">
    <ImagePreviewComp
      size="56px"
      :src="props.category.image"
      :image-search-modal-subtitle="
        extractCurrentLanguageTranslation(props.category)
      "
      :default-image-search-query="props.category.eng"
      @update:src="(src) => updateCategoryImage(src)"
    />
    <h2>
      {{ extractCurrentLanguageTranslation(props.category) }}
    </h2>

    <DropdownMenuComp
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
      <template #trigger="{ isMenuOpen }">
        <ButtonComp
          icon="more_vert"
          appearance="inline"
          color="neutral"
          size="compact"
          class="words-view-category-title__menu-button"
          :pressed="isMenuOpen"
        />
      </template>
    </DropdownMenuComp>

    <RemoveCategoryModalComp
      v-if="isRemoveCategoryModalOpen"
      :category="props.category"
      @close="isRemoveCategoryModalOpen = false"
    />

    <CategoryFormModalComp
      v-if="isEditCategoryModalOpen"
      :category-id="props.category.id"
      @close="isEditCategoryModalOpen = false"
    />
  </div>

  <div v-else class="words-view-category-title">
    <AllWordsCategoryImageComp size="56px" />
    <h2>
      {{ t("all-words") }}
    </h2>
  </div>
</template>

<style scoped lang="scss">
.words-view-category-title {
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

.words-view-category-title:hover,
.dropdown--open {
  .words-view-category-title__menu-button {
    visibility: visible;
  }
}
</style>
