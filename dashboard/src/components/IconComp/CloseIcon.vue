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
      d="M15.8334 5.34167L14.6584 4.16667L10 8.82501L5.34169 4.16667L4.16669 5.34167L8.82502 10L4.16669 14.6583L5.34169 15.8333L10 11.175L14.6584 15.8333L15.8334 14.6583L11.175 10L15.8334 5.34167Z"
    />
  </svg>
</template>
