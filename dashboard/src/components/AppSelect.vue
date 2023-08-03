<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppInputWrapper from "./AppInputWrapper.vue";

export default defineComponent({
	name: "AppSelect",
	components: {
		AppInputWrapper,
	},
	props: {
		label: {
			type: String,
			default: null,
		},
		modelValue: {
			type: String,
			default: null,
		},
		options: {
			type: Array as PropType<{ value: string; label: string }[]>,
			required: true,
		},
	},
	emits: ["update:modelValue"],
	methods: {
		handleSelect(event: Event) {
			const target = event.target as HTMLSelectElement;
			this.$emit("update:modelValue", target.value);
		},
	},
});
</script>

<template>
	<AppInputWrapper
		v-slot="wrapper"
		:label="label"
	>
		<select
			:id="wrapper.id"
			:value="modelValue"
			@input="handleSelect"
		>
			<option
				v-for="item in options"
				:key="item.value"
				:value="item.value"
			>
				{{ item.label }}
			</option>
		</select>
	</AppInputWrapper>
</template>