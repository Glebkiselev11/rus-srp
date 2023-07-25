<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppTopBar",
	data() {
		return {};
	},
});

</script>

<template>
	<header
		class="bg-red full-width q-px-md flex justify-between items-center"
	>
		<div class="flex items-center">
			<div class="q-ml-xs left-container">
				<h6 class="text-h6">
					Srpski reć
				</h6>
				<div class="flex items-center">
					<!-- <Icon
						name="admin_panel_settings"
						color="black"
						size="20px"
					/> -->
					<span class="text-subtitle2 text-grey-7">Admin</span>
				</div>
			</div>
			<h4 class="text-h4">
				Words
			</h4>
		</div>

		<div>test test</div>
	</header>
</template>

<style lang="scss" scoped>

.left-container {
  width: 212px;
}

</style>