<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableRowStatusComp",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mouseInsideModal: false,
      isModalOpen: false,
    };
  },
  methods: {
    handleMouseLeaveRow() {
      if (this.disabled || this.mouseInsideModal) return;

      this.isModalOpen = false;
    },
    handleMouseLeaveModal() {
      this.isModalOpen = false;
      this.mouseInsideModal = false;
    },
    handleMouseOverOnRow() {
      if (this.disabled) return;

      this.isModalOpen = true;
    },
    handleClickInsideModal() {
      this.isModalOpen = false;
    },
  },
});
</script>

<template>
  <tr
    class="table-row-status"
    :class="{
      'table-row-status--disabled': disabled,
    }"
    @mouseover="handleMouseOverOnRow"
    @mouseleave="handleMouseLeaveRow"
  >
    <div
      class="table-row-status__indicator"
      :class="{
        'table-row-status__indicator--active': active,
      }"
    />

    <div
      v-if="isModalOpen"
      class="table-row-status__modal-wrapper"
      @mouseover="mouseInsideModal = true"
      @mouseleave="handleMouseLeaveModal"
      @click="handleClickInsideModal"
    >
      <div class="modal">
        <!-- content of modal -->
        <slot />
      </div>
    </div>
  </tr>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

$width: 12px;

.table-row-status {
  position: relative;
  width: $width;
  height: 100%;

  &:hover {
    background: $color-background-content-primary-hovered;
  }

  &--disabled {
    pointer-events: none;
  }

  &__indicator {
    width: 4px;
    height: inherit;

    &--active {
      background-color: $color-background-negative;
    }
  }

  &__modal-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: $width;
    z-index: 1;
    padding-left: 8px;

    .modal {
      position: relative;
      height: inherit;
      width: inherit;
      background-color: $color-background-content-primary;
      border-radius: 8px;
      padding: 12px;
      box-shadow:
        0 0 4px 0 $shadow,
        0 4px 8px 0 $shadow;

      &::before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        rotate: -45deg;
        background: inherit;
        border-radius: 2px;
        box-shadow: -2px -2px 2px -1px $shadow;
        top: 50%;
        translate: 0 -50%;
        left: -6px;
        z-index: 0;
      }
    }
  }
}
</style>
