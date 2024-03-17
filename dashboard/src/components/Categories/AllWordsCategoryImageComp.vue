<script lang="ts">
import { defineComponent, type PropType } from "vue";
import IconComp from "@/components/IconComp/index.vue";
import type { IconSize } from "@/types/icons";

type Size = "24px" | "56px";

export default defineComponent({
  name: "AllWordsCategoryImageComp",
  components: {
    IconComp,
  },
  props: {
    size: {
      type: String as PropType<Size>,
      required: true,
    },
  },
  computed: {
    iconSize(): IconSize {
      switch (this.size) {
        case "24px":
          return "small";
        default:
          return "regular";
      }
    },
  },
});
</script>

<template>
  <div
    class="all-words-category-image"
    :class="[`all-words-category-image--${size}`]"
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
