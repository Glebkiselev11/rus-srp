<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ExpandMoreUpIcon",
  props: {
    size: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <svg :width="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 8.29998L18 14.3L16.925 15.375L12 10.425L7.075 15.35L6 14.275L12 8.29998Z"
    />
  </svg>
</template>
