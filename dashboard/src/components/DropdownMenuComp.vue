<script lang="ts">
import type { IconColor, IconName } from "@/types/icons";
import { defineComponent, type PropType } from "vue";
import ListItemComp from "./ListItemComp.vue";
import { vOnClickOutside, vElementVisibility } from "@vueuse/components";
import { watchDebounced } from "@vueuse/core";
import IconComp from "@/components/IconComp/index.vue";

type MenuItem = {
  label: string;
  icon?: IconName;
  color?: IconColor;
  handler: () => void;
};

type Separator = "separator";

type MenuPosition = "bottom" | "top";

export default defineComponent({
  name: "DropdownMenuComp",
  directives: {
    onClickOutside: vOnClickOutside,
    elementVisibility: vElementVisibility,
  },
  components: {
    ListItemComp,
    IconComp,
  },
  props: {
    items: {
      type: Array as PropType<Array<MenuItem | Separator>>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMenuOpen: false,
      isBottomMenuVisible: null as boolean | null,
      menuPosition: "bottom" as MenuPosition,
    };
  },
  mounted() {
    watchDebounced(
      () => this.isBottomMenuVisible,
      (visible) => {
        if (!visible && this.isMenuOpen) {
          this.menuPosition = "top";
        }
      },
      { debounce: 10 }
    );
  },
  methods: {
    toggleMenu() {
      if (this.disabled) return;
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    setBottomMenuAngleVisibility(state: boolean) {
      this.isBottomMenuVisible = state;
    },
    handdleClickOnItem(handler: () => void) {
      handler();
      this.closeMenu();
    },
  },
});
</script>

<template>
  <div
    v-on-click-outside="closeMenu"
    class="dropdown"
    :class="{ 'dropdown--open': isMenuOpen }"
  >
    <div @click="toggleMenu">
      <slot :is-menu-open="isMenuOpen" />
    </div>

    <div
      v-if="isMenuOpen"
      class="dropdown__menu"
      :class="[`dropdown__menu-position-${menuPosition}`]"
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
          <IconComp v-if="item.icon" :name="item.icon" :color="item.color" />

          <span :class="[`text-color-${item.color}`]" v-text="item.label" />
        </ListItemComp>
      </template>

      <div
        v-element-visibility="setBottomMenuAngleVisibility"
        class="dropdown__mark-bottom"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.dropdown {
  position: relative;

  &__menu {
    min-inline-size: 148px;
    padding-block: 8px;
    position: absolute;
    right: 0;
    background-color: $color-background-content-primary;
    border-radius: 12px;
    z-index: 9999;
    border: 1px solid $color-separator-primary;
    box-shadow:
      0 0 4px 0 rgb(2 18 38 / 8%),
      0 4px 8px 0 rgb(2 18 38 / 4%);

    &-position-top {
      bottom: 100%;
    }

    &-position-bottom {
      top: 100%;
    }
  }

  hr {
    margin-block: 6px;
  }

  &__mark-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
