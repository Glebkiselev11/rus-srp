<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Category } from "@/types/categories";

export default defineComponent({
	name: "CategoriesPreviewBadgesComp",
	props: {
		categories: {
			type: Array as PropType<Category[]>,
			required: true,
		},
	},
});

</script>

<template>
	<div class="categories-preview-badges">
		<div
			v-for="category in categories"
			:key="category.id"
			class="badge"
		>
			{{ category.eng }}
		</div>
	</div>
</template>

