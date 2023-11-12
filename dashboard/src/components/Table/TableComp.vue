<script lang="ts">
import type { IconColor, IconName } from "../../types/icons";
import { defineComponent, type PropType } from "vue";
import TableColumnTitleComp from "./TableColumnTitleComp.vue";
import type { Order } from "../../types/api";

type Column = {
	sort_key?: string;
	sortable: boolean;
	width?: string;
  label?: string;
	icon?: {
		name: IconName;
		color: IconColor;
	};
}

export default defineComponent({
	name: "TableComp",
	components: {
		TableColumnTitleComp,
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
			isContentBodyScrollable: null as boolean | null,
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
	updated() {
		this.setStateForTableBody();
	},
	methods: {
		setStateForTableBody() {
			const tableBody = this.$refs.tableBody as HTMLElement;

			if (!tableBody) {
				this.isContentBodyScrollable = false;
			}

			this.isContentBodyScrollable = tableBody.scrollHeight > tableBody.clientHeight;
		},
	},
});
</script>

<template>
	<div
		class="table-wrap"
	>
		<table
			class="table" 
		>
			<thead
				v-if="columns.length"
				class="table__header"
				:class="{ 'table__header--scrollable-body': isContentBodyScrollable }"	
			>
				<tr>
					<th v-if="checkable">
						<input
							v-model="checked"
							type="checkbox"
						>
					</th>
					<TableColumnTitleComp
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
			<tbody
				ref="tableBody"
				class="table__body"
			>
				<slot name="body" />
			</tbody>
		</table>

		<slot name="pagination" />
	</div>
</template>

<style  lang="scss">
@import "@/styles/main.scss";
$column-template: repeat(auto-fit, minmax(100px, 1fr));
$extra-space: 270px;

.table-wrap {
	border: 1px solid $color-separator-primary;
	border-radius: 16px;
	overflow: hidden;
}

.table {
	width: 100%;
	background: $color-background-content-primary;
	border-collapse: collapse;

	&__header {
		display: block;
		height: 48px;
		border-block-end: 1px solid $color-separator-primary;

		tr {
			display: grid;
			align-items: center;
			grid-template-columns: $column-template;
			height: inherit;

			th {
				padding-inline: 16px;
			}
		}

		&--scrollable-body {
			padding-inline-end: 4px;
		}
	}

	&__body {
		display: block;
		overflow-y: auto;
		height: calc(100vh - $extra-space);
		position: relative;

		tr {
			display: grid;
			align-items: center;
			grid-template-columns: $column-template;
			border-block-end: 1px solid $color-separator-primary;
		}

		tr:last-child {
			border-block-end: none;
		}
	}

}
</style>
