<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "./ModalComp.vue";
import ButtonComp from "./ButtonComp.vue";

export default defineComponent({
  name: "FormCloseConfirmationModalComp",
  components: {
    ModalComp,
    ButtonComp,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    cancelButtonLabel: {
      type: String,
      required: true,
    },
  },
  emits: ["close", "confirm"],
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
});
</script>

<template>
  <ModalComp :title="title" header-padding-inline="12px" @close="close">
    <template #content>
      <div class="form-close-confirmation-modal">
        {{ $t("modal-exit-confirmation.description") }}

        <div class="form-close-confirmation-modal__buttons">
          <ButtonComp
            :label="cancelButtonLabel"
            appearance="secondary"
            @click="close"
          />
          <ButtonComp
            :label="$t('modal-exit-confirmation.confirm')"
            color="negative"
            @click="confirm"
          />
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<style lang="scss" scoped>
.form-close-confirmation-modal {
  width: 502px;
  padding: 12px;

  &__buttons {
    display: flex;
    justify-content: flex-end;
    column-gap: 8px;
    margin-block-start: 32px;
  }
}
</style>
