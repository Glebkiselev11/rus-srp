<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { capitalizeFirstLetter } from "@/shared/lib";
import { useDraftCategoryStore } from "@/stores/draftCategory";
import type { LanguageCode } from "@/shared/Translate";
import type { Id } from "@/types/api";
import { ModalComp } from "@/shared/ui/Modal";
import CategoryFormComp from "./CategoryFormComp.vue";
import { ImagePreviewComp } from "@/features/ImageExplorer";
import FormCloseConfirmationModalComp from "@/components/FormCloseConfirmationModalComp.vue";
import { storeToRefs } from "pinia";

const { t, locale } = useI18n();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created", id: Id): void;
}>();

const draftCategoryStore = useDraftCategoryStore();
const { isChanged, isEditMode, initialCategory } =
  storeToRefs(draftCategoryStore);

const showCloseConfirmationModal = ref(false);

const title = computed(() => {
  return isEditMode.value ? t("editing-category") : t("creation-category");
});

const subtitle = computed(() => {
  return capitalizeFirstLetter(
    initialCategory.value?.[locale.value as LanguageCode] || ""
  );
});

const closeConfirmationTitle = computed(() => {
  return isEditMode.value
    ? t("modal-exit-confirmation.edit-category-title")
    : t("modal-exit-confirmation.creation-category-title");
});

const closeConfirmationCancelButtonLabel = computed(() => {
  return isEditMode.value
    ? t("modal-exit-confirmation.continue-editing")
    : t("modal-exit-confirmation.continue-creation");
});

function tryClose() {
  if (isChanged.value) {
    showCloseConfirmationModal.value = true;
  } else {
    close();
  }
}

function close() {
  emit("close");
  draftCategoryStore.resetDraftCategory();
}
</script>

<template>
  <ModalComp
    :title="title"
    :subtitle="subtitle"
    header-padding-inline="20px"
    @close="tryClose"
  >
    <template v-if="initialCategory" #header-left>
      <ImagePreviewComp :src="initialCategory.image" static />
    </template>
    <template #content>
      <CategoryFormComp
        @saved="close"
        @created="(id) => $emit('created', id)"
        @close="tryClose"
      />
    </template>
  </ModalComp>

  <FormCloseConfirmationModalComp
    v-if="showCloseConfirmationModal"
    :title="closeConfirmationTitle"
    :cancel-button-label="closeConfirmationCancelButtonLabel"
    @close="showCloseConfirmationModal = false"
    @confirm="close"
  />
</template>
