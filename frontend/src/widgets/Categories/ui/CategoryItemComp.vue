<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { highlighTextByQuery } from "@/shared/lib";
import { useTranslateHelpers } from "@/shared/Translate";
import type { Category } from "@/entities/Category";
import type { Id } from "@/shared/types";
import { ImageComp } from "@/shared/ui/Image";
import { ListItemComp } from "@/shared/ui/ListItem";
import { ButtonComp } from "@/shared/ui/Button";
import { DropdownMenuComp } from "@/shared/ui/DropdownMenu";
import { RemoveCategoryModalComp } from "@/features/RemoveCategory";

const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslateHelpers();

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
        <ImageComp size="24px" :src="category.image" />

        <span
          class="category-item__label text-overflow-ellipsis"
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
.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__row {
    display: inherit;
    align-items: inherit;
    column-gap: 8px;
    overflow: hidden;
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
