<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppInputWrapper",
	props: {
		label: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			uniqueId: Math.random().toString(),
		};
	},
});

</script>

<template>
	<div class="app-input-wrapper">
		<label
			v-if="label"
			:for="uniqueId"
			class="app-input-wrapper--label"
		>
			{{ label }}
		</label>
		<slot :id="uniqueId" />
	</div>
</template>

<style scoped lang="scss">
.app-input-wrapper {
	display: flex;
	flex-direction: column;
}

</style>