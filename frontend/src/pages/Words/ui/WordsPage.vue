<script lang="ts" setup>
import { isMobile } from "@/shared/lib/media";
import WordsPageDesktop from "./Desktop/WordsPageDesktop.vue";
import WordsPageMobile from "./Mobile/WordsPageMobile.vue";

const WordsPage = isMobile() ? WordsPageMobile : WordsPageDesktop;
</script>

<template>
  <component :is="WordsPage" />
</template>
