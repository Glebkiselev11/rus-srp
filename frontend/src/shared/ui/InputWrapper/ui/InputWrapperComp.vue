<script setup lang="ts">
import { ref } from "vue";
import { CaptionComp } from "@/shared/ui/Caption";

type Props = {
  for: string;
  label?: string;
  error?: string;
};

const props = defineProps<Props>();

const target = ref<HTMLElement | null>(null);

function selectInput() {
  const element = target.value?.querySelector(`#${props.for}`) as HTMLElement;
  if (element) {
    element.tagName === "BUTTON" ? element.click() : element.focus();
  }
}
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-wrapper__label" @click="selectInput">
      {{ label }}
    </label>

    <div ref="target">
      <slot />
    </div>

    <CaptionComp v-if="error" type="error" :text="error" size="small" />
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  &__label {
    @include text-body-2;

    &::first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
