<script setup lang="ts">
type Props = {
  label: string | null;
  active: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
}>();

function click(e: MouseEvent) {
  if (!props.active) {
    emit("click", e);
  }
}
</script>

<template>
  <button
    class="pagination-button"
    :class="{ 'pagination-button--active': active }"
    @click="click"
  >
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
@import "src/styles/main";

.pagination-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  background: transparent;

  @include text-body-2;

  &:hover {
    cursor: pointer;
    background: $color-background-content-primary-hovered;
  }

  &--active {
    background: $color-image-placeholder-accent;
    color: $color-text-accent-primary;
    cursor: default;

    &:hover {
      @extend .pagination-button--active;
    }
  }
}
</style>
