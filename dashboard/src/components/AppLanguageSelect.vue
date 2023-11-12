<script lang="ts">
import { defineComponent } from "vue";
import AppSelect from "./AppSelect.vue";
import { LanguageList, STORAGE_KEY } from "@/i18n";

export default defineComponent({
	name: "AppLanguageSelect",
	components: {
		AppSelect,
	},
	data() {
		return {
			options: LanguageList,
		};
	},
	computed: {
		currentLanguage: {
			get() {
				return this.$i18n.locale;
			},
			set(code: string) {
				this.$i18n.locale = code;
				localStorage.setItem(STORAGE_KEY, code);
			},
		},
	},
});

</script>

<template>
	<AppSelect
		v-model="currentLanguage"
		:label="$t('interface-language')"
		:options="options"
		appearance="inline"
		size="compact"
	/>
</template>
