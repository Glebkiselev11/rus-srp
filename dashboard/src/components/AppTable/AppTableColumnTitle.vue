<script lang="ts">
import type { IconColor, IconName } from "@/types/icons";
import { defineComponent, type PropType } from "vue";
import AppIcon from "@/components/AppIcon/index.vue";

export default defineComponent({
	name: "AppTableColumnTitle",
	components: {
		AppIcon,
	},
	props: {
		label: {
			type: String as PropType<string>,
			default: null,
		},
		icon: {
			type: Object as PropType<{ name: IconName, color: IconColor }>,
			default: null,
		},
		width: {
			type: String as PropType<string>,
			default: "auto",
		},
		sortable: {
			type: Boolean as PropType<boolean>,
			default: false,
		},
	},
});

</script>

<template>
	<th :style="{ width }">
		<div 
			class="app-table-column-title"
			:class="{ 'app-table-column-title--sortable': sortable }"
		>
			<AppIcon
				v-if="icon"
				:name="icon.name"
				:color="icon.color"
			/>
			<span
				v-if="label"
				class="app-table-column-title--label text-subtitle-2"
				v-text="label"
			/>

			<AppIcon
				v-if="sortable"
				name="expand_all"
				color="tertiary"
				size="20px"
			/>
		</div>
	</th>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-table-column-title {
  display: flex;
  align-items: center;
  column-gap: 4px;

  &--sortable {
    cursor: pointer;
  }
  &--label {
    color: $color-text-secondary;
  }
}

</style>