<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DoneIcon",
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
      d="M8.99999 16.2L4.79999 12L3.39999 13.4L8.99999 19L21 7.00001L19.6 5.60001L8.99999 16.2Z"
    />
  </svg>
</template>
