<script lang="ts">
import type { IconColor, IconName } from "@/types/icons";
import { defineComponent, type PropType } from "vue";
import AppTableColumnTitle from "./AppTableColumnTitle.vue";
import type { Order } from "@/types/api";

interface Column {
	sort_key: string;
	sortable: boolean;
	width?: string;
  label?: string;
	icon?: {
		name: IconName;
		color: IconColor;
	};
}

export default defineComponent({
	name: "AppTable",
	components: {
		AppTableColumnTitle,
	},
	props: {
		columns: {
			type: Array as PropType<Column[]>,
			required: true,
		},
		checkable: {
			type: Boolean,
			default: false,
		},
		order: {
			type: String as PropType<Order>,
			default: null,
		},
	},
	emits: ["checked", "unchecked", "update:order"],
	data() {
		return {
			checked: false,
		};
	},
	watch: {
		checked(checked: boolean) {
			if (checked) {
				this.$emit("checked");
			} else {
				this.$emit("unchecked");
			}
		},
	},
});
</script>

<template>
	<div class="app-table-wrap">
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
					<AppTableColumnTitle
						v-for="col in columns"
						:key="col.sort_key"
						:sort-key="col.sort_key"
						:style="{ width: col.width ?? 'auto' }"
						:label="col.label"
						:icon="col.icon"
						:width="col.width"
						:sortable="col.sortable"
						:order="order"
						@update:order="x => $emit('update:order', x)"
					/>
				</tr>
			</thead>
			<tbody class="app-table--body">
				<slot />
			</tbody>
		</table>
	</div>
</template>

<style  lang="scss">
@import "@/styles/main.scss";

.app-table-wrap {
	border: 1px solid $color-separator-primary;
	border-radius: 16px;
	overflow: hidden;
}

.app-table {
	width: 100%;
	padding-inline: 16px;
	background: $color-background-content-primary;
	border-collapse: collapse;

	&--header {
		height: 48px;
		border-block-end: 1px solid $color-separator-primary;
		th {
			padding-inline: 16px;
		}
	}

	&--body {
		tr {
			border-block-end: 1px solid $color-separator-primary;
		}

		tr:last-child {
			border-block-end: none;
		}
	}
}
</style>