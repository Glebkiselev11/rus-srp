<script setup lang="ts">
import { IconComp } from "@/shared/ui/Icon";
import { computed } from "vue";

const props = defineProps<{
  size: "24px" | "56px";
}>();

const iconSize = computed(() => {
  switch (props.size) {
    case "24px":
      return "small";
    default:
      return "regular";
  }
});
</script>

<template>
  <div
    class="all-words-category-image"
    :class="[`all-words-category-image--${props.size}`]"
  >
    <IconComp name="widgets" :size="iconSize" color="contrast" />
  </div>
</template>

<style scoped lang="scss">
.all-words-category-image {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(135deg, #e6ff8a, #9facff);

  &--24px {
    width: 24px;
    height: 24px;
  }

  &--56px {
    width: 56px;
    height: 56px;
  }
}
</style>
