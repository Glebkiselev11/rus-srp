<script lang="ts">
import { defineComponent } from "vue";
import TopBar from "@/components/TopBar.vue";

export default defineComponent({
	name: "WordsView",
	components: {
		TopBar,
	},
});
</script>

<template>
	<TopBar />

	<div class="words-view q-mt-md">
		words
	</div>
</template>

<style scoped lang="scss">

.words-view {
	background: red;
	width: 100%;
	height: 100%;
}

</style>