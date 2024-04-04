<script lang="ts">
import { defineComponent } from "vue";
import type { LanguageCode } from "@/types/translations";
import ImageSectionComp from "../ImageSectionComp.vue";
import InputComp from "../InputComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { mapActions, mapState } from "pinia";
import {
  getLanguageLabel,
  translationPreview,
  getLanguageCodesOrder,
} from "@/common/translations";
import ButtonComp from "../ButtonComp.vue";
import CheckboxListItemComp from "../CheckboxListItemComp.vue";
import CheckboxComp from "../CheckboxComp.vue";

export default defineComponent({
  name: "WordFormTranslationComp",
  components: {
    ImageSectionComp,
    InputComp,
    ButtonComp,
    CheckboxListItemComp,
    CheckboxComp,
  },
  props: {
    uniqueWordError: {
      type: Boolean,
      default: false,
    },
    rusValidationError: {
      type: String,
      default: undefined,
    },
    engValidationError: {
      type: String,
      default: undefined,
    },
    srpLatinValidationError: {
      type: String,
      default: undefined,
    },
    srpCyrillicValidationError: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      autoFillTranslationsLoading: false,
    };
  },
  computed: {
    ...mapState(useDraftWordStore, [
      "draftWord",
      "anyTranslationFilled",
      "semifilledTranslations",
      "allTranslationsFilled",
      "isEditMode",
      "isTranslationChanged",
    ]),
    wordPreview(): string {
      if (this.isEditMode || this.anyTranslationFilled) {
        return translationPreview(this.draftWord);
      } else {
        return this.$t("new-word");
      }
    },
    showTranslationApprovedCheckbox() {
      return this.allTranslationsFilled;
    },
  },
  watch: {
    isTranslationChanged(is: boolean) {
      if (is) {
        this.draftWord.translation_approved = false;
      } else {
        this.resetTranslationApproved();
      }
    },
  },
  methods: {
    ...mapActions(useDraftWordStore, [
      "autoFillTranslations",
      "resetTranslationApproved",
    ]),
    getLanguageLabel,
    getLanguageCodesOrder,
    getValidationError(code: LanguageCode) {
      switch (code) {
        case "eng":
          return this.engValidationError;
        case "rus":
          return this.rusValidationError;
        case "srp_latin":
          return this.srpLatinValidationError;
        case "srp_cyrillic":
          return this.srpCyrillicValidationError;
      }
    },
    async _autoFillTranslations() {
      if (!this.semifilledTranslations || this.autoFillTranslationsLoading)
        return;

      try {
        this.autoFillTranslationsLoading = true;
        await this.autoFillTranslations();
      } finally {
        this.autoFillTranslationsLoading = false;
      }
    },
  },
});
</script>

<template>
  <div class="word-form-translation">
    <ImageSectionComp
      :src="draftWord.image"
      :default-image-search-query="draftWord.eng"
      @update:src="draftWord.image = $event"
    >
      <div>
        <h4>{{ $t("image") }}</h4>

        <span>{{ wordPreview }}</span>
      </div>
    </ImageSectionComp>

    <div class="word-form-translation__row">
      <div>
        <span class="word-form-translation__header-wrap">
          <h3>{{ $t("translation") }}</h3>

          <CheckboxListItemComp
            v-if="showTranslationApprovedCheckbox"
            :label="
              $t(draftWord.translation_approved ? 'approved' : 'not-approved')
            "
            appearance="secondary"
            padding-block="6px"
          >
            <CheckboxComp v-model="draftWord.translation_approved" />
          </CheckboxListItemComp>
        </span>

        <span
          v-if="uniqueWordError"
          class="text-color-negative"
          v-text="$t('word-already-exists')"
        />
      </div>

      <ButtonComp
        v-if="semifilledTranslations"
        icon="edit_note"
        appearance="inline"
        :label="$t('fill-in-auto')"
        :loading="autoFillTranslationsLoading"
        @click="_autoFillTranslations"
      />
    </div>

    <InputComp
      v-for="code in getLanguageCodesOrder()"
      :key="code"
      v-model="draftWord[code]"
      appearance="outline"
      :error-text="getValidationError(code)"
      clear-button
      :label="getLanguageLabel(code)"
      class="word-form-translation__input"
      @keypress.enter="_autoFillTranslations"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.word-form-translation {
  @include text-body-2;

  &__tabs {
    margin-block-end: 20px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block: 20px;
    height: 32px;
  }

  &__input {
    margin-block: 20px;
  }

  &__header-wrap {
    display: flex;
    align-items: center;
    column-gap: 16px;
  }
}
</style>
