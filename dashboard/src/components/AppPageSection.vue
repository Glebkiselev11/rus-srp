<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "@/components/AppHeader.vue";

export default defineComponent({
	name: "AppPageSection",
	components: {
		AppHeader,
	},
	props: {
		title: {
			type: String,
			default: null,
		},
	},
});

</script>


<template>
	<div class="app-page-section">
		<AppHeader
			v-if="title"
			:title="title"
		/>

		<div>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-page-section {
  background: $color-background-content-primary;
  width: 549px;
  border-radius: 16px;
  padding: 8px;
  border: 1px solid $color-separator-primary;
}

</style>