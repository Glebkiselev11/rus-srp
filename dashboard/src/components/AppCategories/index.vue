<!-- The side bar with categories -->
<script lang="ts">
import { defineComponent } from "vue";
import AppInput from "@/components/AppInput.vue";


export default defineComponent({
	name: "AppCategories",
	components: {
		AppInput,
	},
	data() {
		return {
			search: "",
		};
	},
});

</script>

<template>
	<div class="app-categories">
		<div class="app-categories--header">
			<AppInput
				v-model="search"
				:placeholder="$t('find-category')"
				left-icon="search"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-categories {
  padding: 12px;
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;
}

</style>