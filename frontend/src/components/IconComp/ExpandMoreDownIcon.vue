<script setup lang="ts">
defineProps<{
  size: string;
}>();
</script>

<template>
  <svg :width="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15.375L6 9.375L7.075 8.3L12 13.25L16.925 8.325L18 9.4L12 15.375Z"
    />
  </svg>
</template>
