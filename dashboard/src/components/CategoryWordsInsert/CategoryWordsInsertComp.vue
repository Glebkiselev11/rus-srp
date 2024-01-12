<script lang="ts">
import { defineComponent } from "vue";
import InputComp from "../InputComp.vue";
import ButtonComp from "../ButtonComp.vue";
import WordFormModalComp from "../WordForm/WordFormModalComp.vue";

export default defineComponent({
	name: "CategoryWordsInsertComp",
	components: {
		InputComp,
		ButtonComp,
		WordFormModalComp,
	},
	props: {
		categoryId: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			showWordForm: false,
			search: "",
		};
	},
});

</script>

<template>
	<div class="category-words-insert">
		<div class="category-words-insert__row">
			<InputComp
				v-model="search"
				appearance="outline"
				clear-button
				debounce
				class="category-words-insert__search-input"
				:placeholder="$t('find-word')"
				left-icon="search"
			/>

			<ButtonComp
				icon="add"
				appearance="inline" 
				class="category-words-insert__create-word-button"
				:label="$t('create-word')"
				@click="showWordForm = true"
			/>
		</div>
	</div>

	<WordFormModalComp
		v-if="showWordForm"
		@close="showWordForm = false"
	/>
</template>

<style lang="scss" scoped>

.category-words-insert {
	padding: 20px;
	width: 704px;

	&__row {
		display: flex;
		align-items: center;
	}

	&__search-input {
		flex-shrink: 1;
	}

	&__create-word-button {
		flex-shrink: 0;
		margin-inline-start: 16px;
	}
}

</style>
