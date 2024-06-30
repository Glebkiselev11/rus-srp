<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Category } from "@/entities/Category";
import { useTranslations } from "@/common/useTranslations";
import ImagePreviewComp from "./ImagePreviewComp.vue";
import { TooltipComp } from "@/shared/ui/Tooltip";
import { ButtonComp } from "@/shared/ui/Button";

const MAX_IMAGES = 3;

const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslations();

type Props = {
  categories: Category[];
  showAddButton?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  showAddButton: false,
});

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
}>();

const names = ref<HTMLSpanElement | undefined>(undefined);

const images = computed(() => {
  return props.categories
    .map((category) => category.image)
    .slice(0, MAX_IMAGES);
});

const categoryNames = computed(() => {
  return props.categories
    .map((category) => extractCurrentLanguageTranslation(category))
    .join(", ");
});

const howManyMoreImages = computed(() => {
  return props.categories.length - MAX_IMAGES;
});

function click(e: MouseEvent) {
  emit("click", e);
}

function isOverflowing() {
  return names.value && names.value.scrollWidth > names.value.clientWidth;
}
</script>

<template>
  <TooltipComp
    v-if="props.categories.length > 0"
    :text="categoryNames"
    position="bottom"
    text-wrap
    color="light"
    :hidden="!isOverflowing()"
  >
    <button class="categories-preview-badges" @click="click">
      <div class="categories-preview-badges__images">
        <div v-for="(src, i) in images" :key="i">
          <ImagePreviewComp :src="src" size="24px" static />
        </div>

        <div
          v-if="howManyMoreImages > 0"
          class="categories-preview-badges__more-images-label"
        >
          +{{ howManyMoreImages }}
        </div>
      </div>

      <span
        ref="names"
        class="categories-preview-badges__names"
        v-text="categoryNames"
      />
    </button>
  </TooltipComp>

  <ButtonComp
    v-else-if="props.showAddButton"
    :label="t('add')"
    icon="add"
    appearance="inline"
    size="compact"
    @click="click"
  />
</template>

<style lang="scss" scoped>
.categories-preview-badges {
  $radius: 8px;

  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  border: none;
  padding: 4px;
  padding-inline-end: 12px;
  border-radius: $radius;
  background: transparent;

  &:hover {
    cursor: pointer;
    background: $color-background-content-primary-hovered;
  }

  &__images {
    margin-right: 14px;
    display: flex;

    div {
      margin-right: -6px;
    }
  }

  &__more-images-label {
    @include text-caption-2;

    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: 4px;
    border-radius: $radius;
    border: 1px solid $color-image-border;
    background: $color-image-placeholder;
    color: $color-text-primary;
    z-index: 1;
  }

  &__names {
    @include text-body-2;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
