<script lang="ts">
import { defineComponent } from "vue";
import SelectComp from "./SelectComp.vue";
import { STORAGE_KEY } from "@/i18n";
import { LanguageList } from "@/common/translations";

export default defineComponent({
	name: "LanguageSelectComp",
	components: {
		SelectComp,
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
	<SelectComp
		v-model="currentLanguage"
		:label="$t('interface-language')"
		:options="options"
		appearance="inline"
		size="compact"
	/>
</template>
