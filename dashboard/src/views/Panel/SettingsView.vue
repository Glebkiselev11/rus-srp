<script lang="ts">
import { defineComponent } from "vue";
import AppTopBar from "@/components/AppTopBar.vue";
import PageSectionComp from "@/components/PageSectionComp.vue";
import IconComp from "@/components/IconComp/index.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import LanguageSelectComp from "@/components/LanguageSelectComp.vue";

export default defineComponent({
	name: "SettingsView",
	components: {
		AppTopBar,
		PageSectionComp,
		IconComp,
		ListItemComp,
		LanguageSelectComp,
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

		<div class="settings-view__content">
			<PageSectionComp :title="$t('general')">
				<ListItemComp>
					<IconComp name="translate" />

					<LanguageSelectComp />
				</ListItemComp>
			</PageSectionComp>
		</div>
	</main>
</template>

<style scoped lang="scss">
@import "@/styles/colors.scss";
.settings-view {
	width: 100%;
	height: 100%;

	&__content {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-block-start: 16px;
	}
}

</style>
