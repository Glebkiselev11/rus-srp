<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { HeaderComp } from "@/shared/ui/Header";

type Props = {
  title: string;
  subtitle?: string;
  headerPaddingInline?: string;
  maxWidth?: string;
};

const props = withDefaults(defineProps<Props>(), {
  subtitle: "",
  headerPaddingInline: "16px",
  maxWidth: "none",
});

const emit = defineEmits<{
  (event: "close"): void;
}>();

onMounted(() => {
  updateBackgroundShadow();
});

onUnmounted(() => {
  updateBackgroundShadow();
});

// It needs us to keep only one shadow (on last modal) for all modals
function updateBackgroundShadow() {
  const modals = document.body.querySelectorAll(".modal-screen");
  const className = "modal-screen--last-modal";
  modals.forEach((modal) => {
    modal.classList.remove(className);
  });

  const lastModal = modals[modals.length - 1];
  if (lastModal) {
    lastModal.classList.add(className);
  }
}

function handleClose() {
  emit("close");
}
</script>

<template>
  <div class="modal-screen">
    <div class="modal" :style="{ maxWidth: props.maxWidth }">
      <HeaderComp
        :title="props.title"
        :subtitle="props.subtitle"
        :padding-inline="props.headerPaddingInline"
        close-button
        @close="handleClose"
      >
        <template #left>
          <slot name="header-left" />
        </template>

        <template #before-subtitle>
          <slot name="header-before-subtitle" />
        </template>
      </HeaderComp>
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-screen {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &--last-modal {
    background-color: #3c495899;
  }
}

.modal {
  border-radius: 16px;
  background: $color-background-content-primary;
  border: 1px solid $color-separator-primary;
  box-shadow:
    0 4px 16px 0 rgb(2 18 38 / 8%),
    0 0 2px 0 rgb(2 18 38 / 8%);
}
</style>
