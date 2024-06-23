<script setup lang="ts">
import { computed, ref } from "vue";
import ButtonComp from "@/components/ButtonComp.vue";
import * as voiceover from "@/common/voiceover";

const props = defineProps<{
  text: string;
  lang: voiceover.Lang;
}>();

const playing = ref(false);

const icon = computed(() => (playing.value ? "brand_awareness" : "volume_up"));

async function play() {
  playing.value = true;
  await voiceover.play(props.text, props.lang);
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
