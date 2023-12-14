<script lang="ts">
import { defineComponent } from "vue";
import InputComp from "../InputComp.vue";
import ButtonComp from "../ButtonComp.vue";
import CategoryFormModalComp from "../CategoryFormModalComp.vue";

export default defineComponent({
	name: "WordFormCategoriesComp",
	components: {
		InputComp,
		ButtonComp,
		CategoryFormModalComp,
	},
	data() {
		return {
			showCategoryForm: false,
			search: "",
		};
	},
});

</script>

<template>
	<div class="word-form-categories">
		<div class="word-form-categories__row">
			<InputComp
				v-model="search"
				appearance="outline"
				clear-button
				class="word-form-categories__search-input"
				:placeholder="$t('find-category')"
				left-icon="search"
			/>

			<ButtonComp
				icon="add"
				class="word-form-categories__create-category-button"
				appearance="inline"
				:label="$t('create-category')"
				@click="showCategoryForm = true"
			/>
		</div>

		<CategoryFormModalComp
			v-if="showCategoryForm"
			@close="showCategoryForm = false"
		/>
	</div>
</template>

<style lang="scss" scoped>

.word-form-categories {
	&__row {
		display: flex;
		justify-content: space-between;
		column-gap: 8px;
	}

	&__search-input {
		flex-shrink: 1;
	}

	&__create-category-button {
		margin-inline-start: 16px;
		flex-shrink: 0;
	}
}

</style>
