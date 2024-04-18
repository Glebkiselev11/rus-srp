<script setup lang="ts">
defineProps<{
  size: string;
}>();
</script>

<template>
  <svg :width="size" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.5 15V13.75H7.5V15H2.5ZM2.5 10.625V9.375H12.5V10.625H2.5ZM2.5 6.25V5H17.5V6.25H2.5Z"
    />
  </svg>
</template>
