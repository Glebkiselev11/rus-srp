<script lang="ts">
import { defineComponent, type PropType } from "vue";

type Tab = {
  name: string;
  error: boolean;
};

export default defineComponent({
  name: "TabsComp",
  props: {
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true,
    },
    selectedTabIndex: {
      type: Number,
      required: true,
    },
    paddingInline: {
      type: String,
      default: "0px",
    },
  },
  emits: ["update:selected-tab-index"],
  methods: {
    handleClick(index: number) {
      this.$emit("update:selected-tab-index", index);
    },
  },
});
</script>

<template>
  <div class="tabs" :style="{ paddingInline }">
    <button
      v-for="(tab, i) in tabs"
      :key="i"
      class="tabs__button"
      :class="{
        'tabs__button--active': i === selectedTabIndex,
        'tabs__button--error': tab.error,
      }"
      :disabled="i === selectedTabIndex"
      @click.stop="handleClick(i)"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.tabs {
  display: flex;
  column-gap: 32px;
  border-block-end: 1px solid $color-separator-primary;

  &__button {
    @include text-body-1;

    color: $color-text-secondary;
    background-color: transparent;
    border: none;
    border-block-end: 2px solid transparent;
    cursor: pointer;
    padding-block-end: 8px;
    padding-inline: 0;
    position: relative;

    &:focus-visible {
      outline: none;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        left: -8px;
        border-radius: 8px;
        top: -4px;
        bottom: -2px;
        width: calc(100% + 16px);
        border: 2px solid $color-stroke-accent;
      }
    }

    &:hover {
      color: $color-text-primary;
    }

    &--active {
      @include text-subtitle-1;

      color: $color-text-primary;
      border-block-end: 2px solid $color-icon-primary;

      &:focus-visible {
        outline: none;
      }
    }

    &--error {
      margin-inline-end: 20px;

      &::after {
        content: "";
        position: absolute;
        width: 6px;
        height: 6px;
        background: $color-icon-negative;
        right: -18px;
        top: 10px;
        border-radius: 50%;
      }
    }

    &:disabled {
      cursor: default;
    }
  }
}
</style>
