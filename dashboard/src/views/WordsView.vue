<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "WordsView",
});
</script>

<template>
	<div class="words-view q-mt-md">
		words
	</div>
</template>

<style scoped lang="scss">

.words-view {
	background: red;
	width: 100%;
	height: 100%;

	&:hover {
		background: blue;
	}	
}

</style>