<script lang="ts">
import { defineComponent } from "vue";
import AppTopBar from "@/components/AppTopBar.vue";
import AppPageSection from "@/components/AppPageSection.vue";

export default defineComponent({
	name: "SettingsView",
	components: {
		AppTopBar,
		AppPageSection,
	},
});

</script>

<template>
	<main class="settings-view">
		<AppTopBar>
			<template #left>
				<h3>{{ $t("settings") }}</h3>
			</template>
		</AppTopBar>

		<div class="settings-view--content">
			<AppPageSection :title="$t('general')" />
		</div>
	</main>
</template>


<style scoped lang="scss">
@import "@/styles/colors.scss";
.settings-view {
	width: 100%;
	height: 100%;

	&--content {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-block-start: 16px;
	}
}

</style>