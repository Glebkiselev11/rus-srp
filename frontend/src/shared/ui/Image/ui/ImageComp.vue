<script setup lang="ts">
import { computed } from "vue";
import { IconComp, type IconSize } from "@/shared/ui/Icon";
import type { PreviewSize } from "../model/types";
import { addCropImagaeParamsToUrl } from "../lib";

type Props = {
  src: string | null;
  size?: PreviewSize;
  clickable?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  size: "40px",
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

const srcWithParams = computed(() => {
  return props.src ? addCropImagaeParamsToUrl(props.src, 200) : "";
});
</script>

<template>
  <button
    class="image-preview"
    :style="{
      width: props.size,
      height: props.size,
      minWidth: props.size,
      minHeight: props.size,
    }"
  >
    <img v-if="srcWithParams" :src="srcWithParams" />
    <IconComp v-else name="filter_hdr" :size="iconSize" color="placeholder" />

    <div v-if="$props.clickable" class="image-preview--overlay">
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
</template>

<style lang="scss" scoped>
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
