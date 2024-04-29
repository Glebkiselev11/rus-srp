<script setup lang="ts">
import { computed } from "vue";
import SelectComp from "./SelectComp.vue";
import { STORAGE_KEY } from "@/i18n";
import { useTranslations } from "@/common/useTranslations";
import { useI18n } from "vue-i18n";

const { getLanguageList } = useTranslations();
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
