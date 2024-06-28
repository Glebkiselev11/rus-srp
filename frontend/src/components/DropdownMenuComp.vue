<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useSlots, watch } from "vue";
import { vOnClickOutside, vElementVisibility } from "@vueuse/components";
import ListItemComp from "./ListItemComp.vue";
import { IconComp, type IconName, type IconColor } from "@/shared/ui/Icon";

export type MenuItem = {
  label: string;
  labelColor?: IconColor;
  description?: string;
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
  maxWidth?: string;
  showMenu?: boolean;
};

const slots = useSlots();

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  position: "left",
  maxWidth: "296px",
  showMenu: false,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const _showMenu = ref(false);
const isBottomMenuVisible = ref<boolean | null>(null);
const menuLeft = ref(0);
const menuTop = ref(0);
const anchor = ref<HTMLElement>();
const menu = ref<HTMLElement>();

const hasTriggerSlot = computed(() => {
  return !!slots.trigger;
});

const isMenuOpen = computed(() => {
  if (hasTriggerSlot.value) {
    return _showMenu.value;
  }

  // If there is no trigger slot, the menu opens from props
  return props.showMenu;
});

watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      calculateMenuPosition();
    });
  }
});

onMounted(() => {
  if (isMenuOpen.value) {
    calculateMenuPosition();
  }
});

function toggleMenu() {
  if (props.disabled) return;
  _showMenu.value = !_showMenu.value;
}

function closeMenu() {
  _showMenu.value = false;
  emit("close");
}

function setBottomMenuAngleVisibility(state: boolean) {
  isBottomMenuVisible.value = state;
}

function handdleClickOnItem(handler: () => void) {
  handler();
  closeMenu();
}

function calculateMenuPosition() {
  if (!anchor.value || !menu.value) return;

  const anchorRect = anchor.value.getBoundingClientRect();
  const menuRect = menu.value.getBoundingClientRect();

  const margin = 8;
  menuTop.value = anchorRect.y + anchorRect.height + margin;

  if (props.position === "left") {
    menuLeft.value = anchorRect.left - menuRect.width + anchorRect.width;
  } else {
    menuLeft.value = anchorRect.left;
  }

  setTimeout(() => {
    if (!isBottomMenuVisible.value) {
      menuTop.value = anchorRect.y - menuRect.height - margin;
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
    <div
      v-if="hasTriggerSlot"
      ref="anchor"
      class="dropdown__trigger"
      @click="toggleMenu"
    >
      <slot name="trigger" :is-menu-open="isMenuOpen" />
    </div>

    <div v-else ref="anchor">
      <slot name="anchor" />
    </div>

    <div
      v-if="isMenuOpen"
      ref="menu"
      class="dropdown__menu"
      :style="{
        left: `${menuLeft}px`,
        top: `${menuTop}px`,
        maxWidth: props.maxWidth,
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

          <div class="list-item-text">
            <span
              :class="[
                'text-overflow-ellipsis',
                `text-color-${getLabelColor(item)}`,
              ]"
              v-text="item.label"
            />

            <span
              v-if="item.description"
              class="text-overflow-ellipsis list-item-text__description"
              v-text="item.description"
            />
          </div>
        </ListItemComp>
      </template>

      <div v-element-visibility="setBottomMenuAngleVisibility" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
    z-index: 3;
    border: 1px solid $color-separator-primary;
    box-shadow:
      0 0 4px 0 rgb(2 18 38 / 8%),
      0 4px 8px 0 rgb(2 18 38 / 4%);
  }

  .list-item-text {
    display: flex;
    flex-direction: column;

    &__description {
      @include text-body-2;
      color: $color-text-secondary;
    }
  }

  hr {
    margin-block: 6px;
  }
}
</style>
