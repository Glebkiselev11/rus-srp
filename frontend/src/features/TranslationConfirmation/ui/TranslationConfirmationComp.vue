<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ButtonComp } from "@/shared/ui/Button";
import { useUpdateWord, type Word } from "@/entities/Word";

const { t } = useI18n();

const updateWord = useUpdateWord();

const props = defineProps<{
  word: Word;
}>();

const emit = defineEmits<{
  (e: "open-editing-word-form"): void;
}>();

function openEditingWordForm() {
  emit("open-editing-word-form");
}

function confirmTranslation() {
  updateWord.mutateAsync({
    ...props.word,
    translation_approved: true,
  });
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
        @click="confirmTranslation"
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
