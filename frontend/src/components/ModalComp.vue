<script lang="ts">
import { defineComponent } from "vue";
import HeaderComp from "@/components/HeaderComp.vue";

export default defineComponent({
  name: "ModalComp",
  components: {
    HeaderComp,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: null,
    },
    headerPaddingInline: {
      type: String,
      default: "16px",
    },
  },
  emits: ["close"],
  mounted() {
    this.updateBackgroundShadow();
  },
  unmounted() {
    this.updateBackgroundShadow();
  },
  methods: {
    handleClose(): void {
      this.$emit("close");
    },
    // It needs us to keep only one shadow (on last modal) for all modals
    updateBackgroundShadow() {
      const modals = document.body.querySelectorAll(".modal-screen");
      const className = "modal-screen--last-modal";
      modals.forEach((modal) => {
        modal.classList.remove(className);
      });

      const lastModal = modals[modals.length - 1];
      if (lastModal) {
        lastModal.classList.add(className);
      }
    },
  },
});
</script>

<template>
  <div class="modal-screen">
    <div class="modal">
      <HeaderComp
        :title="title"
        :subtitle="subtitle"
        :padding-inline="headerPaddingInline"
        close-button
        @close="handleClose"
      >
        <template #left>
          <slot name="header-left" />
        </template>
      </HeaderComp>
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

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
