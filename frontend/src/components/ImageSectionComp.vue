<script setup lang="ts">
import ImagePreviewComp from "./ImagePreviewComp.vue";

type Props = {
  src: string | null;
  imageSearchModalSubtitle?: string;
  defaultImageSearchQuery?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "update:src", src: string): void;
}>();

function updateSrc(src: string) {
  emit("update:src", src);
}
</script>

<template>
  <div class="image-section">
    <ImagePreviewComp
      size="96px"
      :src="props.src"
      :image-search-modal-subtitle="props.imageSearchModalSubtitle"
      :default-image-search-query="props.defaultImageSearchQuery"
      @update:src="updateSrc"
    />

    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.image-section {
  display: flex;
  column-gap: 24px;
  width: 100%;
  height: 144px;
  padding: 24px;
  background: $color-background;
  border-radius: 16px;
}
</style>
