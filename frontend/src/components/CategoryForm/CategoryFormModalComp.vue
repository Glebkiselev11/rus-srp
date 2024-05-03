<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { capitalizeFirstLetter } from "@/common/utils";
import type { LanguageCode } from "@/types/translations";
import type { Id } from "@/types/api";
import ModalComp from "@/components/ModalComp.vue";
import CategoryFormComp from "./CategoryFormComp.vue";
import ImagePreviewComp from "@/components/ImagePreviewComp.vue";
import FormCloseConfirmationModalComp from "@/components/FormCloseConfirmationModalComp.vue";
import { useCategoryByIdQuery } from "@/queries/categories";

const { t, locale } = useI18n();

const props = defineProps<{
  categoryId?: Id; // If provided category id, then form will be in edit mode
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created", id: Id): void;
}>();

const isChanged = ref(false);
const showCloseConfirmationModal = ref(false);

const { data, isFetched } = useCategoryByIdQuery(toRef(props, "categoryId"));

const category = computed(() => {
  return data.value?.category;
});

const showModal = computed(() => {
  return isFetched.value || !Boolean(props.categoryId);
});

const title = computed(() => {
  return props.categoryId ? t("editing-category") : t("creation-category");
});

const subtitle = computed(() => {
  return capitalizeFirstLetter(
    category.value?.[locale.value as LanguageCode] || ""
  );
});

const closeConfirmationTitle = computed(() => {
  return Boolean(category.value)
    ? t("modal-exit-confirmation.edit-category-title")
    : t("modal-exit-confirmation.creation-category-title");
});

const closeConfirmationCancelButtonLabel = computed(() => {
  return Boolean(category.value)
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

function setChanged(status: boolean) {
  isChanged.value = status;
}

function close() {
  emit("close");
}
</script>

<template>
  <ModalComp
    v-if="showModal"
    :title="title"
    :subtitle="subtitle"
    header-padding-inline="20px"
    @close="tryClose"
  >
    <template v-if="category" #header-left>
      <ImagePreviewComp :src="category.image" static />
    </template>
    <template #content>
      <CategoryFormComp
        :category="category"
        @saved="close"
        @created="(id) => $emit('created', id)"
        @close="tryClose"
        @set-changed-status="setChanged"
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
