<!-- Component for adding words into category -->
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import ModalComp from "../ModalComp.vue";
import { useCategoriesActions } from "@/stores/categories/actions";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import { extractCurrentLanguageTranslation } from "@/common/translations";
import ImagePreviewComp from "../ImagePreviewComp.vue";
import CategoryWordsInsertComp from "./CategoryWordsInsertComp.vue";
import { useModalWordsStore } from "@/stores/words/modalWords";
import FormCloseConfirmationModalComp from "../FormCloseConfirmationModalComp.vue";

const { t } = useI18n();

const props = defineProps<{
  categoryId: number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "refetch"): void;
}>();

const modalWordsStore = useModalWordsStore();
const categoriesActionsStore = useCategoriesActions();

const showCloseConfirmationModal = ref(false);

const category = computed(() =>
  categoriesActionsStore.getCategoryById(props.categoryId)
);

const srcWithParams = computed(() => {
  const src = category.value?.image;
  return src ? addCropImagaeParamsToUrl(src, 200) : "";
});

const subtitle = computed(() =>
  category.value ? extractCurrentLanguageTranslation(category.value) : ""
);

function handleWordsInserted() {
  emit("refetch");
  close();
}

function tryClose() {
  if (modalWordsStore.isAnyWordSelected) {
    showCloseConfirmationModal.value = true;
  } else {
    close();
  }
}

function close() {
  emit("close");
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
        @words-inserted="handleWordsInserted"
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
