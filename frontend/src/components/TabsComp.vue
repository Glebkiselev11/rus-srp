<script setup lang="ts">
type Tab = {
  name: string;
  error: boolean;
};

type Props = {
  tabs: Tab[];
  selectedTabIndex: number;
  paddingInline?: string;
};

const props = withDefaults(defineProps<Props>(), {
  paddingInline: "0px",
});

const emit = defineEmits<{
  (event: "update:selected-tab-index", index: number): void;
}>();

function handleClick(index: number) {
  emit("update:selected-tab-index", index);
}
</script>

<template>
  <div class="tabs" :style="{ paddingInline: props.paddingInline }">
    <button
      v-for="(tab, i) in props.tabs"
      :key="i"
      class="tabs__button"
      :class="{
        'tabs__button--active': i === props.selectedTabIndex,
        'tabs__button--error': tab.error,
      }"
      :disabled="i === props.selectedTabIndex"
      @click.stop="handleClick(i)"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
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
