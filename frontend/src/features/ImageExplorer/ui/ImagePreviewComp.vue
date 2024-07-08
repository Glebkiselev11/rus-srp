<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ModalComp } from "@/shared/ui/Modal";
import ImagesSearchComp from "./ImagesSearchComp.vue";
import { type PreviewSize, ImageComp } from "@/shared/ui/Image";

const { t } = useI18n();

type Props = {
  src: string | null;
  imageSearchModalSubtitle?: string;
  defaultImageSearchQuery?: string;
  size?: PreviewSize;
};

const props = withDefaults(defineProps<Props>(), {
  imageSearchModalSubtitle: undefined,
  defaultImageSearchQuery: "",
  size: "40px",
});

const emit = defineEmits<{
  (event: "update:src", src: string): void;
}>();

const isModalVisible = ref(false);

const imagesSearchModalTitle = computed(() => {
  return props.src ? t("edit-image") : t("add-image");
});

function handleClick(e: Event): void {
  e.stopPropagation();
  isModalVisible.value = true;
}

function handleSelectImage(src: string): void {
  emit("update:src", src);
  isModalVisible.value = false;
}
</script>

<template>
  <ImageComp
    :src="props.src"
    :size="props.size"
    clickable
    @click="handleClick"
  />

  <ModalComp
    v-if="isModalVisible"
    :title="imagesSearchModalTitle"
    :subtitle="imageSearchModalSubtitle"
    header-padding-inline="20px"
    @close="isModalVisible = false"
  >
    <template v-if="props.src" #header-left>
      <ImageComp :src="src" :size="props.size" />
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
