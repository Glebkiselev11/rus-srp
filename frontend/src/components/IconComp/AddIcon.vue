<script setup lang="ts">
defineProps<{
  size: string;
}>();
</script>

<template>
  <svg
    :width="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.25 19V12.75H5V11.25H11.25V5H12.75V11.25H19V12.75H12.75V19H11.25Z"
    />
  </svg>
</template>
