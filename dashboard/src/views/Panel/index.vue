<script lang="ts">
import { defineComponent } from "vue";
import NavbarComp from "@/components/NavbarComp.vue";
import NavbarItemComp from "@/components/NavbarItemComp.vue";
import { RouterView } from "vue-router";
import type { NavItem } from "../../types";
import TooltipComp from "@/components/TooltipComp.vue";
import { logout } from "@/common/auth";

export default defineComponent({
  name: "PanelView",
  components: {
    RouterView,
    NavbarComp,
    TooltipComp,
    NavbarItemComp,
  },
  data() {
    return {};
  },
  computed: {
    panelPages(): NavItem[] {
      return [
        {
          label: this.$t("all-words"),
          name: "words",
          icon: "list" as const,
          active: false,
        },
        {
          label: this.$t("settings"),
          name: "settings",
          icon: "settings" as const,
          active: false,
        },
      ].map((x: NavItem) => ({
        ...x,
        active: x.name === this.$route.name,
      }));
    },
  },
  methods: {
    changePage(item: NavItem) {
      this.$router.push({ name: item.name });
    },
    handleLogout() {
      logout();
      this.$router.push({ name: "login" });
    },
  },
});
</script>

<template>
  <div class="panel-view">
    <NavbarComp :items="panelPages" @click-on-item="changePage">
      <template #bottom>
        <TooltipComp :text="$t('logout')" position="right">
          <NavbarItemComp
            :label="$t('logout')"
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
