<!-- Component for adding words into category -->
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref, toRef } from "vue";
import { ModalComp } from "@/shared/ui/Modal";
import { useTranslateHelpers } from "@/shared/Translate";
import { ImageComp } from "@/shared/ui/Image";
import CategoryWordsInsertComp from "./CategoryWordsInsertComp.vue";
import { useCategoryWordsInsertStore } from "../model/categoryWordsInsert";
import { CloseConfirmationModalComp } from "@/shared/ui/CloseConfirmation";
import type { Id } from "@/shared/types";
import { useCategoryByIdQuery } from "@/entities/Category";

const { t } = useI18n();
const { extractCurrentLanguageTranslation } = useTranslateHelpers();

const props = defineProps<{
  categoryId: Id;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const categoryWordsInsertStore = useCategoryWordsInsertStore();

const showCloseConfirmationModal = ref(false);

const { data } = useCategoryByIdQuery(toRef(props, "categoryId"));

const category = computed(() => data.value?.category);

const categoryImage = computed(() => {
  const src = category.value?.image;
  return src ?? "";
});

const subtitle = computed(() =>
  category.value ? extractCurrentLanguageTranslation(category.value) : ""
);

function tryClose() {
  if (categoryWordsInsertStore.isAnyWordSelected) {
    showCloseConfirmationModal.value = true;
  } else {
    close();
  }
}

function close() {
  emit("close");
  categoryWordsInsertStore.$reset();
}
</script>

<template>
  <ModalComp
    :title="t('adding-words-into-category')"
    :subtitle="subtitle"
    @close="tryClose"
  >
    <template #header-left>
      <ImageComp :src="categoryImage" />
    </template>
    <template #content>
      <CategoryWordsInsertComp
        :category-id="categoryId"
        @close="tryClose"
        @words-inserted="close"
      />
    </template>
  </ModalComp>

  <CloseConfirmationModalComp
    v-if="showCloseConfirmationModal"
    :title="t('modal-exit-confirmation.adding-words-in-category-title')"
    :cancel-button-label="t('modal-exit-confirmation.continue-editing')"
    @close="showCloseConfirmationModal = false"
    @confirm="close"
  />
</template>
