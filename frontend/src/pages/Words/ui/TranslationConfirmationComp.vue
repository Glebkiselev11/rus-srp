<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ButtonComp } from "@/shared/ui/Button";

const { t } = useI18n();

const emit = defineEmits<{
  (e: "confirm-translation"): void;
  (e: "open-editing-word-form"): void;
}>();

function confirmTranslation() {
  emit("confirm-translation");
}

function openEditingWordForm() {
  emit("open-editing-word-form");
}
</script>

<template>
  <div class="translation-confirmation">
    <span
      class="translation-confirmation__title"
      v-text="t('translation-not-confirmed')"
    />

    <div class="translation-confirmation__buttons">
      <ButtonComp
        :label="t('confirm')"
        size="compact"
        appearance="secondary"
        @click="confirmTranslation()"
      />
      <ButtonComp
        :label="t('edit')"
        size="compact"
        appearance="inline"
        icon="edit"
        @click="openEditingWordForm()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.translation-confirmation {
  display: flex;
  flex-direction: column;

  &__title {
    @include text-subtitle-1;

    margin-block-end: 12px;
  }

  &__buttons {
    display: flex;
    column-gap: 16px;
  }
}
</style>
