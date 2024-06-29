<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import TopBarComp from "@/components/TopBarComp.vue";
import PageSectionComp from "@/components/PageSectionComp.vue";
import { IconComp } from "@/shared/ui/Icon";
import ListItemComp from "@/components/ListItemComp.vue";
import { LanguageSelectComp } from "@/shared/i18n";

const { t } = useI18n();
</script>

<template>
  <main class="settings-view">
    <TopBarComp>
      <template #left>
        <h3>{{ t("settings") }}</h3>
      </template>
    </TopBarComp>

    <div class="settings-view__content">
      <PageSectionComp :title="t('general')">
        <ListItemComp>
          <IconComp name="translate" />

          <LanguageSelectComp />
        </ListItemComp>
      </PageSectionComp>
    </div>
  </main>
</template>

<style scoped lang="scss">
.settings-view {
  width: 100%;
  height: 100%;

  &__content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-block-start: 16px;
  }
}
</style>
