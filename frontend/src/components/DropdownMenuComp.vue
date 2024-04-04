<script lang="ts">
import type { IconColor, IconName } from "@/types/icons";
import { defineComponent, type PropType } from "vue";
import ListItemComp from "./ListItemComp.vue";
import { vOnClickOutside, vElementVisibility } from "@vueuse/components";
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
    position: {
      type: String as PropType<MenuPosition>,
      default: "left",
    },
  },
  data() {
    return {
      isMenuOpen: false,
      isBottomMenuVisible: null as boolean | null,
      menuLeft: 0,
      menuTop: 0,
    };
  },
  methods: {
    toggleMenu() {
      if (this.disabled) return;
      this.isMenuOpen = !this.isMenuOpen;

      if (this.isMenuOpen) {
        this.$nextTick(() => {
          this.calculateMenuPosition();
        });
      }
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
    calculateMenuPosition() {
      const trigger = this.$refs.trigger as HTMLElement;
      const menu = this.$refs.menu as HTMLElement;
      if (!trigger || !menu) return {};

      const triggerRect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      const margin = 8;
      this.menuTop = triggerRect.y + triggerRect.height + margin;

      if (this.position === "left") {
        this.menuLeft = triggerRect.left - menuRect.width + triggerRect.width;
      } else {
        this.menuLeft = triggerRect.left;
      }

      setTimeout(() => {
        if (!this.isBottomMenuVisible) {
          this.menuTop = triggerRect.y - menuRect.height - margin;
        }
      }, 10);
    },
    getIconColor(item: MenuItem) {
      return item.iconColor || item.color;
    },
    getLabelColor(item: MenuItem) {
      return item.labelColor || item.color;
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
