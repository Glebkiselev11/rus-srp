<!-- The side bar with categories -->
<script lang="ts">
import { defineComponent } from "vue";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";


export default defineComponent({
	name: "AppCategories",
	components: {
		AppInput,
		AppButton,
	},
	data() {
		return {
			search: "",
		};
	},
	methods: {
		addCategory() {
			console.log("add category");
		},
	},
});

</script>

<template>
	<div class="app-categories">
		<div class="app-categories__header">
			<AppInput
				v-model="search"
				:placeholder="$t('find-category')"
				left-icon="search"
			/>

			<div class="app-categories__row">
				<span class="text-subtitle-1">{{ $t('categories') }}</span>

				<div>
					<AppButton
						icon="add"
						type="inline"
						color="neutral"
						@click="addCategory"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-categories {
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;

  &__header {
		display: flex;
		flex-direction: column;
    padding: 12px;
		row-gap: 12px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
		align-items: center;
  }
}

</style>