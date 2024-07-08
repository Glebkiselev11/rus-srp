<script setup lang="ts">
import { useToaster } from "../model/store";
import { IconComp } from "@/shared/ui/Icon";

const toastStore = useToaster();
</script>

<template>
  <div class="toaster">
    <div
      v-for="(toast, i) in toastStore.toasts"
      :key="i"
      class="toaster__toast"
    >
      <IconComp
        v-if="toast.type === 'success'"
        name="check_circle"
        color="positive"
      />

      {{ toast.message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toaster {
  position: fixed;
  inset-inline-start: 96px;
  inset-block-end: 24px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  &__toast {
    @include text-body-2;
    color: $color-text-contrast;

    display: flex;
    align-items: center;
    max-width: 344px;
    column-gap: 18px;
    background: $color-background-tooltip;
    padding-block: 12px;
    padding-inline: 16px;
    border-radius: 12px;

    transform: translateY(100%);
    animation: slide-up 0.2s forwards;
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
</style>
