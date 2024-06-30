<script setup lang="ts">
import { computed, ref } from "vue";
import { ButtonComp } from "@/shared/ui/Button";
import type { Lang } from "../model/types";
import { playText } from "../lib/voiceover";

const props = defineProps<{
  text: string;
  lang: Lang;
}>();

const playing = ref(false);

const icon = computed(() => (playing.value ? "brand_awareness" : "volume_up"));

async function play() {
  playing.value = true;
  await playText(props.text, props.lang);
  playing.value = false;
}
</script>

<template>
  <ButtonComp
    :icon="icon"
    appearance="inline"
    icon-color="tertiary"
    size="small"
    @click="play"
  />
</template>
