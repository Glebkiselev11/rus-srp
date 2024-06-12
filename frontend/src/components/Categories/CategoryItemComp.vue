<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { highlighTextByQuery } from "@/common/utils";
import { useTranslations } from "@/common/useTranslations";
import type { Category } from "@/types/categories";
import type { Id } from "@/types/api";
import ImagePreviewComp from "@/components/ImagePreviewComp.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import ButtonComp from "../ButtonComp.vue";
import DropdownMenuComp from "../DropdownMenuComp.vue";
import RemoveCategoryModalComp from "./RemoveCategoryModalComp.vue";

const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslations();

type Props = {
  category: Category;
  selected: boolean;
  query: string;
};

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  query: "",
});

const emit = defineEmits<{
  (e: "selectCateogry", catedoryId: Id): void;
  (e: "select-category-for-editing", catedory: Category): void;
}>();

const isRemoveCategoryModalOpen = ref(false);

function openRemoveCategoryModal() {
  isRemoveCategoryModalOpen.value = true;
}

function selectCategory() {
  if (props.selected) return;
  emit("selectCateogry", props.category.id);
}

function editCategory(category: Category) {
  emit("select-category-for-editing", category);
}
</script>

<template>
  <ListItemComp
    clickable
    :selected="selected"
    size="compact"
    padding-inline="8px"
    class="list-item"
    @click="selectCategory"
  >
    <div class="category-item">
      <div class="category-item__row">
        <ImagePreviewComp size="24px" :src="category.image" static />

        <span
          class="category-item__label"
          v-html="
            highlighTextByQuery(
              extractCurrentLanguageTranslation(category),
              query
            )
          "
        />
      </div>

      <DropdownMenuComp
        :items="[
          {
            label: t('edit'),
            icon: 'edit',
            handler: () => editCategory(category),
          },
          'separator',
          {
            label: t('delete'),
            icon: 'delete',
            color: 'negative',
            handler: openRemoveCategoryModal,
          },
        ]"
        @click.stop
      >
        <template #trigger="{ isMenuOpen }">
          <ButtonComp
            icon="more_vert"
            appearance="inline"
            color="neutral"
            size="small"
            class="category-item__menu-button"
            :pressed="isMenuOpen"
          />
        </template>
      </DropdownMenuComp>
    </div>
  </ListItemComp>

  <RemoveCategoryModalComp
    v-if="isRemoveCategoryModalOpen"
    :category="category"
    @close="isRemoveCategoryModalOpen = false"
  />
</template>

<style scoped lang="scss">
@import "@/styles/main";

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__row {
    display: inherit;
    align-items: inherit;
    column-gap: 8px;
  }

  &__label {
    @include text-body-2;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  &__menu-button {
    visibility: hidden;
  }
}

.list-item:hover,
.dropdown--open {
  .category-item__menu-button {
    visibility: visible;
  }
}
</style>
