<script lang="ts">
import { defineComponent } from "vue";
import AppTopBar from "@/components/AppTopBar.vue";
import AppPageSection from "@/components/AppPageSection.vue";
import IconComp from "@/components/IconComp/index.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import LanguageSelectComp from "@/components/LanguageSelectComp.vue";

export default defineComponent({
	name: "SettingsView",
	components: {
		AppTopBar,
		AppPageSection,
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
			<AppPageSection :title="$t('general')">
				<ListItemComp>
					<IconComp name="translate" />

					<LanguageSelectComp />
				</ListItemComp>
			</AppPageSection>
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
