<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ModalComp from "../ModalComp.vue";
import WordFormComp from "./WordFormComp.vue";
import { mapActions, mapState } from "pinia";
import { useWordsActionsStore } from "@/stores/words/actions";
import { useWordFormTabsStore } from "@/stores/wordFormTabs";
import type { Word } from "@/types/words";
import FormCloseConfirmationModalComp from "../FormCloseConfirmationModalComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { translationPreview } from "@/common/translations";
import { usePageWordsStore } from "@/stores/words/pageWords";

export default defineComponent({
  name: "WordFormModalComp",
  components: {
    ModalComp,
    WordFormComp,
    FormCloseConfirmationModalComp,
  },
  props: {
    // If provided word id, then form will be in edit mode
    wordId: {
      type: [String, Number] as PropType<Word["id"]>,
      default: undefined,
    },
  },
  emits: ["close"],
  data() {
    return {
      showCloseConfirmationModal: false,
    };
  },
  computed: {
    ...mapState(useWordsActionsStore, ["getWordById"]),
    ...mapState(useDraftWordStore, [
      "anyTranslationFilled",
      "draftWord",
      "isChanged",
    ]),
    word(): Word | undefined {
      return this.wordId ? this.getWordById(this.wordId) : undefined;
    },
    title(): string {
      return this.wordId ? this.$t("editing-word") : this.$t("creation-word");
    },
    subtitle(): string {
      if (this.word) {
        return translationPreview(this.word);
      } else if (this.anyTranslationFilled) {
        return translationPreview(this.draftWord);
      } else {
        return this.$t("new-word");
      }
    },
    closeConfirmationTitle() {
      return Boolean(this.word)
        ? this.$t("modal-exit-confirmation.edit-word-title")
        : this.$t("modal-exit-confirmation.creation-word-title");
    },
    closeConfirmationCancelButtonLabel() {
      return Boolean(this.word)
        ? this.$t("modal-exit-confirmation.continue-editing")
        : this.$t("modal-exit-confirmation.continue-creation");
    },
  },
  methods: {
    ...mapActions(useWordFormTabsStore, ["resetCurrentTab"]),
    ...mapActions(usePageWordsStore, ["refetchPageWords"]),
    close() {
      this.$emit("close");
      this.resetCurrentTab();
      this.refetchPageWords();
    },
    tryClose() {
      if (this.isChanged) {
        this.showCloseConfirmationModal = true;
      } else {
        this.close();
      }
    },
  },
});
</script>

<template>
  <ModalComp :title="title" :subtitle="subtitle" @close="tryClose">
    <template #content>
      <WordFormComp :word="word" @close="tryClose" @saved="close" />
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
