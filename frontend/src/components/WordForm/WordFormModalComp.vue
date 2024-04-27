<script setup lang="ts">
import { computed, ref } from "vue";
import ModalComp from "../ModalComp.vue";
import WordFormComp from "./WordFormComp.vue";
import { useWordFormTabsStore } from "@/stores/wordFormTabs";
import FormCloseConfirmationModalComp from "../FormCloseConfirmationModalComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { useTranslations } from "@/common/useTranslations";
import { useI18n } from "vue-i18n";

const { translationPreview } = useTranslations();
const { t } = useI18n();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const showCloseConfirmationModal = ref(false);

const draftWordStore = useDraftWordStore();
const wordFormTabsStore = useWordFormTabsStore();

const title = computed(() => {
  return draftWordStore.initialWord ? t("editing-word") : t("creation-word");
});

const subtitle = computed(() => {
  if (draftWordStore.initialWord) {
    return translationPreview(draftWordStore.initialWord);
  } else if (draftWordStore.anyTranslationFilled) {
    return translationPreview(draftWordStore.draftWord);
  } else {
    return t("new-word");
  }
});

const closeConfirmationCancelButtonLabel = computed(() =>
  draftWordStore.initialWord
    ? t("modal-exit-confirmation.continue-editing")
    : t("modal-exit-confirmation.continue-creation")
);

const closeConfirmationTitle = computed(() =>
  draftWordStore.initialWord
    ? t("modal-exit-confirmation.edit-word-title")
    : t("modal-exit-confirmation.creation-word-title")
);

function tryClose() {
  if (draftWordStore.isChanged) {
    showCloseConfirmationModal.value = true;
  } else {
    close();
  }
}

function close() {
  emit("close");
  wordFormTabsStore.resetCurrentTab();
}
</script>

<template>
  <ModalComp :title="title" :subtitle="subtitle" @close="tryClose">
    <template #content>
      <WordFormComp
        :initial-word="draftWordStore.initialWord"
        @close="tryClose"
        @saved="close"
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
