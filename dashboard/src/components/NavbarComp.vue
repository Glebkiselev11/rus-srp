<script lang="ts">
import { defineComponent, type PropType } from "vue";
import NavbarItemComp from "./NavbarItemComp.vue";
import type { NavItem } from "../types";
import TooltipComp from "./TooltipComp.vue";

export default defineComponent({
  name: "NavbarComp",
  components: {
    NavbarItemComp,
    TooltipComp,
  },
  props: {
    items: {
      type: Array as PropType<NavItem[]>,
      required: true,
    },
  },
  emits: ["clickOnItem"],
  methods: {
    handleClick(item: NavItem) {
      this.$emit("clickOnItem", item);
    },
  },
});
</script>

<template>
  <aside class="navbar">
    <div class="navbar__list">
      <TooltipComp
        v-for="item in items"
        :key="item.name"
        :text="$t(item.name)"
        position="right"
      >
        <NavbarItemComp
          :label="item.label"
          :active="item.active"
          :icon-name="item.icon"
          @click="handleClick(item)"
        />
      </TooltipComp>
    </div>

    <div class="navbar__list">
      <slot name="bottom" />
    </div>
  </aside>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.navbar {
  padding-block: 10px;
  width: 72px;
  height: 100%;
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-inline: 12px;

  &__list {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
}
</style>
