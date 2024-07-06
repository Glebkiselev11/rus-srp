<script setup lang="ts">
import { computed, ref } from "vue";
import { ModalComp } from "@/shared/ui/Modal";
import WordFormComp from "./WordFormComp.vue";
import { IconComp } from "@/shared/ui/Icon";
import { useWordFormTabsStore } from "../model/wordFormTabs";
import FormCloseConfirmationModalComp from "@/components/FormCloseConfirmationModalComp.vue";
import { useDraftWordStore } from "../model/draftWord";
import { useTranslateHelpers } from "@/shared/Translate";
import { useI18n } from "vue-i18n";
import type { Id } from "@/shared/types";
import { storeToRefs } from "pinia";

const { translationPreview } = useTranslateHelpers();
const { t } = useI18n();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "created", createdWordId: Id): void;
}>();

const showCloseConfirmationModal = ref(false);

const draftWordStore = useDraftWordStore();
const wordFormTabsStore = useWordFormTabsStore();
const { uniqueWordError, allTranslationsFilled } = storeToRefs(draftWordStore);

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

const translationApproved = computed(
  () => draftWordStore.draftWord.translation_approved
);

const showUnprovedStatus = computed(() => {
  return (
    !translationApproved.value &&
    allTranslationsFilled.value &&
    !uniqueWordError.value
  );
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
  draftWordStore.resetDraftWord();
}

function handleCreated(createdWordId: Id) {
  emit("created", createdWordId);
}
</script>

<template>
  <ModalComp :title="title" :subtitle="subtitle" @close="tryClose">
    <template v-if="showUnprovedStatus" #header-before-subtitle>
      <IconComp name="mark_status" color="negative" size="compact" />
    </template>

    <template #content>
      <WordFormComp
        :initial-word="draftWordStore.initialWord"
        @close="tryClose"
        @created="handleCreated"
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
