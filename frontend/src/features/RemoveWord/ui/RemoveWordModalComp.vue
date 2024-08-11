<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useDeleteWord, type Word } from "@/entities/Word";
import { useTranslateHelpers, type LanguageCode } from "@/shared/Translate";
import { ModalComp } from "@/shared/ui/Modal";
import { InputComp } from "@/shared/ui/Input";
import { ButtonComp } from "@/shared/ui/Button";

const { t, locale } = useI18n();
const deleteWord = useDeleteWord();
const { translationPreview } = useTranslateHelpers();

const props = defineProps<{
  word: Word;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const confirmationInput = ref("");

const title = computed(() =>
  t("word-removing.title", { word: translationPreview(props.word) })
);

const confirmed = computed(() => {
  const key = props.word[locale.value as LanguageCode].toLocaleLowerCase();
  const input = confirmationInput.value.toLocaleLowerCase();
  return key === input;
});

async function removeWord() {
  try {
    await deleteWord.mutateAsync(props.word.id);
    close();
  } catch (error) {
    console.log("error on removing word: ", error);
  }
}

function close() {
  emit("close");
}
</script>

<template>
  <ModalComp :title="title" max-width="520px" @close="close">
    <template #content>
      <div class="remove-word-modal">
        <span v-text="t('word-removing.description')" />

        <InputComp
          v-model="confirmationInput"
          focus-on-mount
          :label="t('word-removing.label')"
        />

        <div class="remove-word-modal__buttons">
          <ButtonComp
            :label="t('cancel')"
            color="neutral"
            appearance="secondary"
            @click="close"
          />
          <ButtonComp
            :disabled="!confirmed"
            color="negative"
            :label="t('yes-remove')"
            @click="removeWord"
          />
        </div>
      </div>
    </template>
  </ModalComp>
</template>
