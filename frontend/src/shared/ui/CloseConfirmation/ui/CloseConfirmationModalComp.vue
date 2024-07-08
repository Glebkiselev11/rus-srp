<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ModalComp } from "@/shared/ui/Modal";
import { ButtonComp } from "@/shared/ui/Button";

const { t } = useI18n();

const props = defineProps<{
  title: string;
  cancelButtonLabel: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "confirm"): void;
}>();

function close() {
  emit("close");
}

function confirm() {
  emit("confirm");
}
</script>

<template>
  <ModalComp :title="props.title" header-padding-inline="20px" @close="close">
    <template #content>
      <div class="close-confirmation-modal">
        {{ t("modal-exit-confirmation.description") }}

        <div class="close-confirmation-modal__buttons">
          <ButtonComp
            :label="props.cancelButtonLabel"
            appearance="secondary"
            @click="close"
          />
          <ButtonComp
            :label="t('modal-exit-confirmation.confirm')"
            color="negative"
            @click="confirm"
          />
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<style lang="scss" scoped>
.close-confirmation-modal {
  width: 502px;
  padding: 20px;

  &__buttons {
    display: flex;
    justify-content: flex-end;
    column-gap: 8px;
    margin-block-start: 32px;
  }
}
</style>
