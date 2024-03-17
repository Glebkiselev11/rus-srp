<script lang="ts">
import { defineComponent } from "vue";
import ErrorComp from "./ErrorComp.vue";

export default defineComponent({
  name: "InputWrapperComp",
  components: { ErrorComp },
  props: {
    label: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    for: {
      type: String,
      required: true,
    },
  },
  methods: {
    selectInput() {
      const target = this.$refs.target as HTMLElement;
      const element = target.querySelector(`#${this.for}`) as HTMLElement;
      if (element) {
        element.tagName === "BUTTON" ? element.click() : element.focus();
      }
    },
  },
});
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-wrapper__label" @click="selectInput">
      {{ label }}
    </label>

    <div ref="target">
      <slot />
    </div>

    <ErrorComp v-if="error" :text="error" size="small" />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

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
