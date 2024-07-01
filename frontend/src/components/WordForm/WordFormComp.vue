<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { useWordFormTabsStore } from "@/stores/wordFormTabs";
import { useI18n } from "vue-i18n";
import { ButtonComp } from "@/shared/ui/Button";
import TabsComp from "../TabsComp.vue";
import WordFormTranslationComp from "./WordFormTranslationComp.vue";
import WordFormCategoriesComp from "./WordFormCategoriesComp.vue";
import {
  useUpdateWord,
  useCreateWord,
  WordsService,
  type DraftWord,
} from "@/entities/Word";
import type { Id } from "@/shared/types";
import { useToaster } from "@/shared/ui/Toaster";
import { useTranslateHelpers } from "@/shared/Translate";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const toaster = useToaster();
const { extractCurrentLanguageTranslation } = useTranslateHelpers();

const props = defineProps<{
  initialWord?: DraftWord;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created", createdWordId: Id): void;
}>();

const updateWord = useUpdateWord();
const createWord = useCreateWord();

const draftWordStore = useDraftWordStore();
const wordFormTabsStore = useWordFormTabsStore();
const { uniqueWordError } = storeToRefs(draftWordStore);

const savingLoading = ref(false);
const rusValidationError = ref<string | undefined>(undefined);
const engValidationError = ref<string | undefined>(undefined);
const srpCyrillicValidationError = ref<string | undefined>(undefined);
const srpLatinValidationError = ref<string | undefined>(undefined);

const saveButtonLabel = computed(() => {
  return props.initialWord ? t("save-changes") : t("create");
});

const anyTranslationError = computed(() => {
  return Boolean(
    rusValidationError.value ||
      engValidationError.value ||
      srpLatinValidationError.value ||
      srpCyrillicValidationError.value ||
      uniqueWordError.value
  );
});

const isValidToSave = computed(() => {
  return (
    draftWordStore.allTranslationsFilled &&
    !uniqueWordError.value &&
    !anyTranslationError.value
  );
});

watch(
  () => draftWordStore.draftWord.rus,
  () => {
    rusValidationError.value = undefined;
    uniqueWordError.value = false;
  }
);

watch(
  () => draftWordStore.draftWord.eng,
  () => {
    engValidationError.value = undefined;
    uniqueWordError.value = false;
  }
);

watch(
  () => draftWordStore.draftWord.srp_latin,
  () => {
    srpLatinValidationError.value = undefined;
    uniqueWordError.value = false;
  }
);

watch(
  () => draftWordStore.draftWord.srp_cyrillic,
  () => {
    srpCyrillicValidationError.value = undefined;
    uniqueWordError.value = false;
  }
);

watch(anyTranslationError, (state) => {
  wordFormTabsStore.setTranslationsTabError(state);
});

function close() {
  emit("close");
}

async function triggerWordNameUniqueValidation() {
  const search = draftWordStore.draftWord.eng;

  if (!search) {
    uniqueWordError.value = false;
    return;
  }

  const { words } = await WordsService.query({ search });

  const exists = words.find(({ eng, rus, srp_cyrillic, srp_latin }) => {
    return (
      eng === draftWordStore.draftWord.eng.toLocaleLowerCase() &&
      rus === draftWordStore.draftWord.rus.toLocaleLowerCase() &&
      srp_cyrillic ===
        draftWordStore.draftWord.srp_cyrillic.toLocaleLowerCase() &&
      srp_latin === draftWordStore.draftWord.srp_latin.toLocaleLowerCase()
    );
  });

  // If word exists and it's the same word we are editing
  // so we are fine
  if (draftWordStore.initialWord?.id === exists?.id) {
    uniqueWordError.value = false;
    return;
  }

  if (exists) {
    uniqueWordError.value = true;
  } else {
    uniqueWordError.value = false;
  }
}

async function triggerValidation() {
  const checkFieldPresence = (x: string) => (x ? undefined : t("required"));

  rusValidationError.value = checkFieldPresence(draftWordStore.draftWord.rus);
  engValidationError.value = checkFieldPresence(draftWordStore.draftWord.eng);
  srpCyrillicValidationError.value = checkFieldPresence(
    draftWordStore.draftWord.srp_cyrillic
  );
  srpLatinValidationError.value = checkFieldPresence(
    draftWordStore.draftWord.srp_latin
  );

  await triggerWordNameUniqueValidation();
}

async function saveWord(saveAndAddNext = false) {
  await triggerValidation();

  if (!isValidToSave.value) return;

  savingLoading.value = true;
  const id = draftWordStore.draftWord.id;

  if (id) {
    await updateWord.mutateAsync({
      ...draftWordStore.draftWord,
      id,
    });

    toaster.addToast({
      type: "success",
      message: t("changes-saved"),
    });
  } else {
    const { data } = await createWord.mutateAsync(draftWordStore.draftWord);

    if (data) {
      emit("created", data.id);
      toaster.addToast({
        message: t("word-created-successfully", {
          word: extractCurrentLanguageTranslation(data),
        }),
        type: "success",
      });
    }
  }

  savingLoading.value = false;

  draftWordStore.resetDraftWord();

  if (!saveAndAddNext) {
    close();
  }
}
</script>

<template>
  <TabsComp
    :tabs="wordFormTabsStore.tabs"
    padding-inline="16px"
    :selected-tab-index="wordFormTabsStore.currentTabIndex"
    class="word-form__tabs"
    @update:selected-tab-index="wordFormTabsStore.setCurrentTabIndex"
  />

  <div class="word-form">
    <div class="word-form__content">
      <WordFormTranslationComp
        v-show="wordFormTabsStore.isTranslationsTabOpen"
        :unique-word-error="uniqueWordError"
        :rus-validation-error="rusValidationError"
        :eng-validation-error="engValidationError"
        :srp-cyrillic-validation-error="srpCyrillicValidationError"
        :srp-latin-validation-error="srpLatinValidationError"
      />

      <WordFormCategoriesComp v-show="wordFormTabsStore.isCategoriesTabOpen" />
    </div>

    <div class="word-form__footer">
      <ButtonComp appearance="secondary" :label="t('cancel')" @click="close" />

      <ButtonComp
        v-if="!initialWord"
        appearance="primary"
        :label="t('create-and-add-next')"
        color="accent-secondary"
        @click="saveWord(true)"
      />

      <ButtonComp
        :label="saveButtonLabel"
        :loading="savingLoading"
        @click="saveWord()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.word-form {
  width: 596px;

  &__content {
    padding-block-start: 20px;
    padding-inline: 16px;
    height: 600px;
    overflow-y: auto;
    border-block-end: 1px solid $color-separator-primary;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    column-gap: 8px;
    padding-inline: 16px;
    padding-block: 20px;
  }
}

@media screen and (max-height: 800px) {
  .word-form__content {
    height: calc(100vh - 200px);
  }
}
</style>
