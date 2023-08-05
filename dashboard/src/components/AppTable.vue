<script lang="ts">
import { defineComponent, type PropType } from "vue";

interface Column {
  label: string;
	sortobale: boolean;
	width?: string;
}

export default defineComponent({
	name: "AppTable",
	props: {
		columns: {
			type: Array as PropType<Column[]>,
			required: true,
		},
		checkable: {
			type: Boolean,
			default: false,
		},

	},
	data() {
		return {
			checked: false,
		};
	},
});
</script>

<template>
	<table class="app-table">
		<thead
			v-if="columns.length"
			align="left"
			class="app-table--header"
		>
			<tr>
				<th v-if="checkable">
					<input
						v-model="checked"
						type="checkbox"
					>
				</th>
				<th
					v-for="col in columns"
					:key="col.label"
					:style="{ width: col.width ?? 'auto' }"
				>
					{{ col.label }}
				</th>
			</tr>
		</thead>
		<tbody>
			<slot />
		</tbody>
	</table>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-table {
	width: 100%;
	border: 1px solid $color-separator-primary;
	border-radius: 16px;
	padding-inline: 16px;

	&--header {
		height: 48px;
	}
}
</style>