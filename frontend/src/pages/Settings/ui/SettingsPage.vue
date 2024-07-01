<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import TopBarComp from "@/components/TopBarComp.vue";
import PageSectionComp from "./PageSectionComp.vue";
import { IconComp } from "@/shared/ui/Icon";
import { ListItemComp } from "@/shared/ui/ListItem";
import { LanguageSelectComp } from "@/shared/i18n";
import { NavbarWidget } from "@/widgets/Navbar";

const { t } = useI18n();
</script>

<template>
  <div class="settings-page-wrap">
    <NavbarWidget />
    <main class="settings-page">
      <TopBarComp>
        <template #left>
          <h3>{{ t("settings") }}</h3>
        </template>
      </TopBarComp>

      <div class="settings-page__content">
        <PageSectionComp :title="t('general')">
          <ListItemComp>
            <IconComp name="translate" />

            <LanguageSelectComp />
          </ListItemComp>
        </PageSectionComp>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.settings-page-wrap {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  height: 100%;
}

.settings-page {
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
