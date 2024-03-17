<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AddIcon",
  props: {
    size: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <svg :width="size" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.6667 10.8334H10.8333V16.6667H9.16666V10.8334H3.33333V9.16671H9.16666V3.33337H10.8333V9.16671H16.6667V10.8334Z"
    />
  </svg>
</template>
