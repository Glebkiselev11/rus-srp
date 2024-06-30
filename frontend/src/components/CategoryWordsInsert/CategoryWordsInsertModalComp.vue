<!-- Component for adding words into category -->
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref, toRef } from "vue";
import { ModalComp } from "@/shared/ui/Modal";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import { useTranslations } from "@/common/useTranslations";
import ImagePreviewComp from "../ImagePreviewComp.vue";
import CategoryWordsInsertComp from "./CategoryWordsInsertComp.vue";
import { useModalWordsStore } from "@/stores/modalWords";
import FormCloseConfirmationModalComp from "../FormCloseConfirmationModalComp.vue";
import type { Id } from "@/types/api";
import { useCategoryByIdQuery } from "@/entities/Category";

const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslations();

const props = defineProps<{
  categoryId: Id;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const modalWordsStore = useModalWordsStore();

const showCloseConfirmationModal = ref(false);

const { data } = useCategoryByIdQuery(toRef(props, "categoryId"));

const category = computed(() => data.value?.category);

const srcWithParams = computed(() => {
  const src = category.value?.image;
  return src ? addCropImagaeParamsToUrl(src, 200) : "";
});

const subtitle = computed(() =>
  category.value ? extractCurrentLanguageTranslation(category.value) : ""
);

function tryClose() {
  if (modalWordsStore.isAnyWordSelected) {
    showCloseConfirmationModal.value = true;
  } else {
    close();
  }
}

function close() {
  emit("close");
  modalWordsStore.$reset();
}
</script>

<template>
  <ModalComp
    :title="t('adding-words-into-category')"
    :subtitle="subtitle"
    @close="tryClose"
  >
    <template #header-left>
      <ImagePreviewComp :src="srcWithParams" static />
    </template>
    <template #content>
      <CategoryWordsInsertComp
        :category-id="categoryId"
        @close="tryClose"
        @words-inserted="close"
      />
    </template>
  </ModalComp>

  <FormCloseConfirmationModalComp
    v-if="showCloseConfirmationModal"
    :title="t('modal-exit-confirmation.adding-words-in-category-title')"
    :cancel-button-label="t('modal-exit-confirmation.continue-editing')"
    @close="showCloseConfirmationModal = false"
    @confirm="close"
  />
</template>
