<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RemoveIcon",
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
    <path d="M5 12.75V11.25H19V12.75H5Z" />
  </svg>
</template>
