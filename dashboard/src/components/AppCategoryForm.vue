<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppCategoryForm",
	components: {},
	props: {
		categoryId: {
			type: Number,
			default: undefined,
		},
	},

});
</script>

<template>
	<div class="app-category-form">
		hi from form
	</div>
</template>

<style lang="scss" scoped>

.app-category-form {
	padding: 16px;
}
</style>
