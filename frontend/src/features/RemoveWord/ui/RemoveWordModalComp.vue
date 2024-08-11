<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useDeleteWord, type Word } from "@/entities/Word";
import { useTranslateHelpers, type LanguageCode } from "@/shared/Translate";
import { ModalComp } from "@/shared/ui/Modal";
import { InputComp } from "@/shared/ui/Input";
import { ButtonComp } from "@/shared/ui/Button";
import { useToaster } from "@/shared/ui/Toaster";

const { t, locale } = useI18n();
const { mutateAsync, isPending } = useDeleteWord();
const { translationPreview } = useTranslateHelpers();
const toaster = useToaster();

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

const label = computed(() =>
  t("word-removing.label", { word: props.word[locale.value as LanguageCode] })
);

const confirmed = computed(() => {
  const key = props.word[locale.value as LanguageCode].toLocaleLowerCase();
  const input = confirmationInput.value.toLocaleLowerCase();
  return key === input;
});

async function removeWord() {
  try {
    await mutateAsync(props.word.id);
    toaster.addToast({
      type: "info",
      message: t("word-removing.toast", {
        word: props.word[locale.value as LanguageCode],
      }),
    });

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
  <ModalComp
    :title="title"
    max-width="520px"
    header-padding-inline="20px"
    @close="close"
  >
    <template #content>
      <div class="remove-word-modal">
        <span v-text="t('word-removing.description')" />

        <InputComp v-model="confirmationInput" focus-on-mount :label="label" />

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
            :loading="isPending"
            @click="removeWord"
          />
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<style scoped lang="scss">
.remove-word-modal {
  padding-block: 12px;
  padding-inline: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .remove-word-modal__buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-block-start: 20px;
  }
}
</style>
