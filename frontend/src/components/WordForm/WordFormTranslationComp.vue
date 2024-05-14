<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, watch } from "vue";
import type { LanguageCode } from "@/types/translations";
import { useDraftWordStore } from "@/stores/draftWord";

import { useTranslations } from "@/common/useTranslations";
import ButtonComp from "../ButtonComp.vue";
import CheckboxListItemComp from "../CheckboxListItemComp.vue";
import CheckboxComp from "../CheckboxComp.vue";
import ImageSectionComp from "../ImageSectionComp.vue";
import InputComp from "../InputComp.vue";

type Props = {
  uniqueWordError?: boolean;
  rusValidationError?: string;
  engValidationError?: string;
  srpLatinValidationError?: string;
  srpCyrillicValidationError?: string;
};

const { translationPreview, getLanguageCodesOrder, getLanguageLabel } =
  useTranslations();
const { t } = useI18n();
const draftWordStore = useDraftWordStore();

const props = withDefaults(defineProps<Props>(), {
  uniqueWordError: false,
  rusValidationError: undefined,
  engValidationError: undefined,
  srpLatinValidationError: undefined,
  srpCyrillicValidationError: undefined,
});

const wordPreview = computed(() => {
  if (draftWordStore.isEditMode || draftWordStore.anyTranslationFilled) {
    return translationPreview(draftWordStore.draftWord);
  } else {
    return t("new-word");
  }
});

const showTranslationApprovedCheckbox = computed(() => {
  return draftWordStore.allTranslationsFilled && !props.uniqueWordError;
});

watch(
  () => draftWordStore.isTranslationChanged,
  (is) => {
    if (is) {
      draftWordStore.draftWord.translation_approved = false;
    } else {
      draftWordStore.resetTranslationApproved();
    }
  }
);

function getValidationError(code: LanguageCode) {
  switch (code) {
    case "eng":
      return props.engValidationError;
    case "rus":
      return props.rusValidationError;
    case "srp_latin":
      return props.srpLatinValidationError;
    case "srp_cyrillic":
      return props.srpCyrillicValidationError;
  }
}

function _autoFillTranslations() {
  const { autoFillTranslationsLoading, semifilledTranslations } =
    draftWordStore;

  if (!semifilledTranslations || autoFillTranslationsLoading) {
    return;
  }

  draftWordStore.autoFillTranslations();
}
</script>

<template>
  <div class="word-form-translation">
    <ImageSectionComp
      :src="draftWordStore.draftWord.image"
      :default-image-search-query="draftWordStore.draftWord.eng"
      @update:src="draftWordStore.draftWord.image = $event"
    >
      <div>
        <h4>{{ t("image") }}</h4>

        <span>{{ wordPreview }}</span>
      </div>
    </ImageSectionComp>

    <div class="word-form-translation__row">
      <div>
        <span class="word-form-translation__header-wrap">
          <h3>{{ t("translation") }}</h3>

          <CheckboxListItemComp
            v-if="showTranslationApprovedCheckbox"
            :label="t('approved')"
            appearance="secondary"
            padding-block="6px"
          >
            <CheckboxComp
              v-model="draftWordStore.draftWord.translation_approved"
            />
          </CheckboxListItemComp>
        </span>

        <span
          v-if="props.uniqueWordError"
          class="text-color-negative"
          v-text="t('word-already-exists')"
        />
      </div>

      <ButtonComp
        v-if="draftWordStore.semifilledTranslations"
        icon="edit_note"
        appearance="inline"
        :label="t('fill-in-auto')"
        :loading="draftWordStore.autoFillTranslationsLoading"
        @click="_autoFillTranslations"
      />
    </div>

    <InputComp
      v-for="code in getLanguageCodesOrder()"
      :key="code"
      v-model="draftWordStore.draftWord[code]"
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
