<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import type { IconSize } from "@/types/icons";
import IconComp from "@/components/IconComp/index.vue";
import ModalComp from "@/components/ModalComp.vue";
import ImagesSearchComp from "./ImagesSearchComp.vue";

type PreviewSize = "24px" | "32px" | "40px" | "48px" | "56px" | "64px" | "96px";

const { t } = useI18n();

type Props = {
  src: string | null;
  imageSearchModalSubtitle?: string;
  static?: boolean;
  defaultImageSearchQuery?: string;
  size?: PreviewSize;
};

const props = withDefaults(defineProps<Props>(), {
  imageSearchModalSubtitle: undefined,
  static: false,
  defaultImageSearchQuery: "",
  size: "40px",
});

const emit = defineEmits<{
  (event: "update:src", src: string): void;
}>();

const isModalVisible = ref(false);

const srcWithParams = computed(() => {
  return props.src ? addCropImagaeParamsToUrl(props.src, 200) : "";
});

const imagesSearchModalTitle = computed(() => {
  return props.src ? t("edit-image") : t("add-image");
});

const iconSize = computed((): IconSize => {
  switch (props.size) {
    case "24px":
      return "small";
    case "32px":
    case "40px":
      return "compact";
    default:
      return "regular";
  }
});

function handleClick(e: Event): void {
  if (props.static) return;

  e.stopPropagation();
  isModalVisible.value = true;
}

function handleSelectImage(src: string): void {
  emit("update:src", src);
  isModalVisible.value = false;
}
</script>

<template>
  <button
    class="image-preview"
    :disabled="props.static"
    :style="{
      width: props.size,
      height: props.size,
      minWidth: props.size,
      minHeight: props.size,
    }"
    @click="handleClick"
  >
    <img v-if="props.src" :src="srcWithParams" />
    <IconComp v-else name="filter_hdr" :size="iconSize" color="placeholder" />

    <div v-if="!props.static" class="image-preview--overlay">
      <IconComp
        v-if="props.src"
        name="edit"
        color="contrast"
        :size="iconSize"
      />

      <IconComp
        v-else
        name="add_photo_alternate"
        color="contrast"
        :size="iconSize"
      />
    </div>
  </button>

  <ModalComp
    v-if="!props.static && isModalVisible"
    :title="imagesSearchModalTitle"
    :subtitle="imageSearchModalSubtitle"
    header-padding-inline="20px"
    @close="isModalVisible = false"
  >
    <template v-if="props.src" #header-left>
      <ImagePreviewComp :src="srcWithParams" static />
    </template>

    <template #content>
      <ImagesSearchComp
        :default-search-query="props.defaultImageSearchQuery"
        :saved-link="props.src"
        @select="handleSelectImage"
      />
    </template>
  </ModalComp>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.image-preview {
  border: 1px solid $color-image-border;
  border-radius: 8px;
  overflow: hidden;
  background-color: $color-image-placeholder;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: inherit;

  img {
    width: inherit;
    height: inherit;
  }

  &--overlay {
    visibility: hidden;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-avatar-overlay-alpha;
  }

  &:hover {
    .image-preview--overlay {
      visibility: visible;
      cursor: pointer;
    }
  }
}
</style>
