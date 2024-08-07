<script setup lang="ts">
import type { Id } from "@/shared/types";
import type { Category } from "@/entities/Category";
import { highlighTextByQuery } from "@/shared/lib";
import { useTranslateHelpers } from "@/shared/Translate";
import { ListItemComp } from "@/shared/ui/ListItem";
import { ImageComp } from "@/shared/ui/Image";

type Props = {
  category: Category;
  query?: string;
};

const { extractCurrentLanguageTranslation } = useTranslateHelpers();

const props = withDefaults(defineProps<Props>(), {
  query: "",
});

const emit = defineEmits<{
  (e: "selectCateogry", catedoryId: Id): void;
}>();

function selectCategory() {
  emit("selectCateogry", props.category.id);
}
</script>

<template>
  <ListItemComp
    clickable
    size="compact"
    padding-inline="8px"
    class="list-item"
    @click="selectCategory"
  >
    <div class="word-form-category-item">
      <div class="word-form-category-item__row">
        <ImageComp size="24px" :src="props.category.image" />

        <span
          class="word-form-category-item__label"
          v-html="
            highlighTextByQuery(
              extractCurrentLanguageTranslation(props.category),
              query
            )
          "
        />
      </div>

      <div class="word-form-category-item__right-icon">
        <slot />
      </div>
    </div>
  </ListItemComp>
</template>

<style scoped lang="scss">
.word-form-category-item {
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

  &__right-icon {
    visibility: hidden;
  }
}

.list-item:hover {
  .word-form-category-item__right-icon {
    visibility: visible;
  }
}
</style>
