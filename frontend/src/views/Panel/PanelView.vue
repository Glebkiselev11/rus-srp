<script setup lang="ts">
import { computed } from "vue";
import NavbarComp from "@/components/NavbarComp.vue";
import NavbarItemComp from "@/components/NavbarItemComp.vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import type { NavItem } from "../../types";
import { TooltipComp } from "@/shared/ui/Tooltip";
import { logout } from "@/common/auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const panelPages = computed(() =>
  [
    {
      label: t("all-words"),
      name: "words",
      icon: "list" as const,
      active: false,
    },
    {
      label: t("settings"),
      name: "settings",
      icon: "settings" as const,
      active: false,
    },
  ].map((x: NavItem) => ({
    ...x,
    active: x.name === route.name,
  }))
);

function changePage(item: NavItem) {
  router.push({ name: item.name });
}

function handleLogout() {
  logout();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="panel-view">
    <NavbarComp :items="panelPages" @click-on-item="changePage">
      <template #bottom>
        <TooltipComp :text="t('logout')" position="right">
          <NavbarItemComp
            :label="t('logout')"
            icon-name="logout"
            @click="handleLogout"
          />
        </TooltipComp>
      </template>
    </NavbarComp>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.panel-view {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: $color-background;
}
</style>
