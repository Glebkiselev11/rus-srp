<script lang="ts">
import { defineComponent } from "vue";
import HeaderComp from "@/components/HeaderComp.vue";

export default defineComponent({
  name: "PageSectionComp",
  components: {
    HeaderComp,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
  },
});
</script>

<template>
  <div class="page-section">
    <HeaderComp v-if="title" :title="title" />

    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.page-section {
  background: $color-background-content-primary;
  width: 549px;
  border-radius: 16px;
  padding: 8px;
  border: 1px solid $color-separator-primary;
}
</style>
