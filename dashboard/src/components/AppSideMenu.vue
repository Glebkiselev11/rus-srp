<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppIcon from "@/components/AppIcon/index.vue";

export default defineComponent({
	name: "AppSideMenu",
	components: {
		AppIcon,
	},
	props: {
		items: {
			type: Array as PropType<string[]>,
			required: true,
		},
	},
	data() {
		return {};
	},
});
</script>


<template>
	<aside class="app-side-menu">
		<div class="app-side-menu--header">
			<AppIcon
				name="admin_panel_settings"
			/>
			<div>
				<h3 class="title">
					Srpski rec
				</h3>
				<span class="description">Admin</span>
			</div>
		</div>

		<nav>
			<div
				v-for="i in items"
				:key="i"
			>
				{{ i }}	
			</div>
		</nav>
	</aside>
</template>


<style scoped lang="scss">
@import "@/styles/main.scss";

.app-side-menu {
  width: 256px;
  height: 100%;

	&--header {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 12px 20px;

		.title {
			color: $color-text-primary;
		}
		.description {
			@extend .text-body-2;
			color: $color-text-secondary;
		}
	}
}

</style>