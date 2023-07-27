<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "AppSideMenu",
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
		side menu
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