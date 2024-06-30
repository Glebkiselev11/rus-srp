<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { SelectComp } from "@/shared/ui/Select";
import { STORAGE_KEY } from "../config";
import { useTranslateHelpers } from "@/shared/Translate";

const { getLanguageList } = useTranslateHelpers();
const { t, locale } = useI18n();

const options = getLanguageList();

const currentLanguage = computed({
  get: () => locale.value,
  set: (code: string) => {
    locale.value = code;
    localStorage.setItem(STORAGE_KEY, code);
  },
});
</script>

<template>
  <SelectComp
    v-model="currentLanguage"
    :label="t('interface-language')"
    :options="options"
    appearance="inline"
    size="compact"
  />
</template>
