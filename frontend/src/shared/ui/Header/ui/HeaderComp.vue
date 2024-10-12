<script setup lang="ts">
import { computed, ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { ButtonComp } from "@/shared/ui/Button";
import type { TitleTag } from "../model/types";

type Props = {
  title?: string;
  titleTag?: TitleTag;
  paddingInline?: string;
  subtitle?: string;
  closeButton?: boolean;
  maxWidth?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  titleTag: "h3",
  paddingInline: "16px",
  subtitle: undefined,
  closeButton: false,
  maxWidth: "none",
});

const emit = defineEmits<{
  (event: "close", e: Event): void;
}>();

const rightContainer = ref(null);
const { width } = useElementSize(rightContainer);

const leftPartMaxWidth = computed(() => {
  return `calc(${props.maxWidth} - ${width.value}px - ${props.paddingInline} - 16px)`;
});

function close(e: Event): void {
  emit("close", e);
}
</script>

<template>
  <header class="header" :style="{ paddingInline: props.paddingInline }">
    <div class="header__part-container">
      <slot name="left" />
      <div>
        <component
          :is="props.titleTag"
          v-if="props.title"
          class="text-overflow-ellipsis"
          :style="{ maxWidth: leftPartMaxWidth }"
        >
          {{ props.title }}
        </component>

        <div class="subtitle" :style="{ maxWidth: leftPartMaxWidth }">
          <slot name="before-subtitle" />

          <span
            v-if="props.subtitle"
            class="subtitle__text text-overflow-ellipsis"
            v-text="props.subtitle"
          />
        </div>
      </div>
    </div>

    <div ref="rightContainer" class="header__part-container">
      <slot name="right" />

      <ButtonComp
        v-if="props.closeButton"
        icon="close"
        appearance="inline"
        color="neutral"
        class="header__close-button"
        @click.stop="close"
      />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  min-height: 48px;
  padding-block: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__part-container {
    display: flex;
    align-items: center;
    column-gap: 16px;
  }

  &__close-button {
    margin-inline-start: 16px;
  }

  .subtitle {
    display: flex;
    align-items: center;
    &__text {
      @include text-body-2;
      color: $color-text-primary;
    }
  }
}
</style>
