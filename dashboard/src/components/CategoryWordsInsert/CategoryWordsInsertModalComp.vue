<!-- Component for adding words into category -->
<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "../ModalComp.vue";
import { mapActions, mapState } from "pinia";
import { useCategoriesActions } from "@/stores/categories/actions";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import { extractCurrentLanguageTranslation } from "@/common/translations";
import ImagePreviewComp from "../ImagePreviewComp.vue";
import CategoryWordsInsertComp from "./CategoryWordsInsertComp.vue";
import { useModalWordsStore } from "@/stores/words/modalWords";
import FormCloseConfirmationModalComp from "../FormCloseConfirmationModalComp.vue";

export default defineComponent({
  name: "CategoryWordsInsertModalComp",
  components: {
    ModalComp,
    ImagePreviewComp,
    CategoryWordsInsertComp,
    FormCloseConfirmationModalComp,
  },
  props: {
    categoryId: {
      type: Number,
      required: true,
    },
  },
  emits: ["close", "refetch"],
  data() {
    return {
      showCloseConfirmationModal: false,
    };
  },
  computed: {
    ...mapState(useCategoriesActions, ["getCategoryById"]),
    ...mapState(useModalWordsStore, ["isAnyWordSelected"]),
    category() {
      return this.getCategoryById(this.categoryId);
    },
    srcWithParams(): string {
      const src = this.category?.image;
      return src ? addCropImagaeParamsToUrl(src, 200) : "";
    },
    subtitle() {
      return this.category
        ? extractCurrentLanguageTranslation(this.category)
        : "";
    },
  },
  methods: {
    ...mapActions(useModalWordsStore, ["clearModalWords"]),
    tryClose() {
      if (this.isAnyWordSelected) {
        this.showCloseConfirmationModal = true;
      } else {
        this.close();
      }
    },
    close() {
      this.$emit("close");
      this.clearModalWords();
    },
    handleWordsInserted() {
      this.$emit("refetch");
      this.close();
    },
  },
});
</script>

<template>
  <ModalComp
    :title="$t('adding-words-into-category')"
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
    :title="$t('modal-exit-confirmation.adding-words-in-category-title')"
    :cancel-button-label="$t('modal-exit-confirmation.continue-editing')"
    @close="showCloseConfirmationModal = false"
    @confirm="close"
  />
</template>
