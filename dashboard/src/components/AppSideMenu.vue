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
		<div>
			<AppIcon
				name="admin_panel_settings"
			/>
			<div>
				<h3>Srpski rec</h3>
				<span class="body-2">Admin</span>
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

.app-side-menu {
  width: 256px;
  height: 100%;
}

</style>