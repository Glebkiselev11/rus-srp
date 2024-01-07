<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TopBarComp",
	data() {
		return {};
	},
});

</script>

<template>
	<header
		class="top-bar"
	>
		<div class="top-bar__content">
			<div>
				<slot name="left" />	
			</div>

			<div>
				<slot name="right" />
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.top-bar{
	padding: 16px;

	&__content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 56px;

		div {
			display: inherit;
			align-items: inherit
		}
	}
}

</style>
