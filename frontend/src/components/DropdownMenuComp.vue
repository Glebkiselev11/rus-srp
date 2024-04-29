<script setup lang="ts">
import { nextTick, ref } from "vue";
import { vOnClickOutside, vElementVisibility } from "@vueuse/components";
import type { IconColor, IconName } from "@/types/icons";
import ListItemComp from "./ListItemComp.vue";
import IconComp from "@/components/IconComp/index.vue";

type MenuItem = {
  label: string;
  labelColor?: IconColor;
  icon?: IconName;
  color?: IconColor;
  iconColor?: IconColor;
  handler: () => void;
};

type Separator = "separator";

type MenuPosition = "left" | "right";

type Props = {
  items: Array<MenuItem | Separator>;
  disabled?: boolean;
  position?: MenuPosition;
};

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  position: "left",
});

const isMenuOpen = ref(false);
const isBottomMenuVisible = ref<boolean | null>(null);
const menuLeft = ref(0);
const menuTop = ref(0);
const trigger = ref<HTMLElement>();
const menu = ref<HTMLElement>();

function toggleMenu() {
  if (props.disabled) return;
  isMenuOpen.value = !isMenuOpen.value;

  if (isMenuOpen.value) {
    nextTick(() => {
      calculateMenuPosition();
    });
  }
}

function closeMenu() {
  isMenuOpen.value = false;
}

function setBottomMenuAngleVisibility(state: boolean) {
  isBottomMenuVisible.value = state;
}

function handdleClickOnItem(handler: () => void) {
  handler();
  closeMenu();
}

function calculateMenuPosition() {
  if (!trigger.value || !menu.value) return;

  const triggerRect = trigger.value.getBoundingClientRect();
  const menuRect = menu.value.getBoundingClientRect();

  const margin = 8;
  menuTop.value = triggerRect.y + triggerRect.height + margin;

  if (props.position === "left") {
    menuLeft.value = triggerRect.left - menuRect.width + triggerRect.width;
  } else {
    menuLeft.value = triggerRect.left;
  }

  setTimeout(() => {
    if (!isBottomMenuVisible.value) {
      menuTop.value = triggerRect.y - menuRect.height - margin;
    }
  }, 10);
}

function getIconColor(item: MenuItem) {
  return item.iconColor || item.color;
}
function getLabelColor(item: MenuItem) {
  return item.labelColor || item.color;
}
</script>

<template>
  <div
    v-on-click-outside="closeMenu"
    class="dropdown"
    :class="{ 'dropdown--open': isMenuOpen }"
  >
    <div ref="trigger" class="dropdown__trigger" @click="toggleMenu">
      <slot :is-menu-open="isMenuOpen" />
    </div>

    <div
      v-if="isMenuOpen"
      ref="menu"
      class="dropdown__menu"
      :style="{
        left: `${menuLeft}px`,
        top: `${menuTop}px`,
      }"
    >
      <template v-for="(item, i) in items" :key="i">
        <template v-if="item === 'separator'">
          <hr />
        </template>

        <ListItemComp
          v-else
          clickable
          @click="handdleClickOnItem(item.handler)"
        >
          <IconComp
            v-if="item.icon"
            :name="item.icon"
            :color="getIconColor(item)"
          />

          <span
            :class="[`text-color-${getLabelColor(item)}`]"
            v-text="item.label"
          />
        </ListItemComp>
      </template>

      <div v-element-visibility="setBottomMenuAngleVisibility" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.dropdown {
  &__menu {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-inline-size: 148px;
    padding: 8px;
    background-color: $color-background-content-primary;
    border-radius: 12px;
    z-index: 9999;
    border: 1px solid $color-separator-primary;
    box-shadow:
      0 0 4px 0 rgb(2 18 38 / 8%),
      0 4px 8px 0 rgb(2 18 38 / 4%);
  }

  hr {
    margin-block: 6px;
  }
}
</style>
