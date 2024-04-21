<script setup lang="ts">
import type { NavItem } from "../types";
import NavbarItemComp from "./NavbarItemComp.vue";
import TooltipComp from "./TooltipComp.vue";

const props = defineProps<{
  items: NavItem[];
}>();

const emit = defineEmits<{
  (event: "clickOnItem", item: NavItem): void;
}>();

function handleClick(item: NavItem) {
  emit("clickOnItem", item);
}
</script>

<template>
  <aside class="navbar">
    <div class="navbar__list">
      <TooltipComp
        v-for="item in props.items"
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
  height: 100%;
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;

  &__list {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
}
</style>
