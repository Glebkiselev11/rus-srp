<script lang="ts">
import { defineComponent } from "vue";
import AppTopBar from "@/components/AppTopBar.vue";
import AppInput from "@/components/AppInput.vue";

export default defineComponent({
	name: "WordsView",
	components: {
		AppTopBar,
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
	<div class="words-view">
		<AppTopBar>
			<template #left>
				<AppInput
					v-model="search"
					type="text"
					:placeholder="$t('find-word')"
				/>	
			</template>
			<template #right>
				right
			</template>
		</AppTopBar>

		<div class="words-view--content">
			words
		</div>
	</div>
</template>

<style scoped lang="scss">

.words-view {
	width: 100%;
	height: 100%;
	
	&--content {
		padding: 20px;
	}
}

</style>