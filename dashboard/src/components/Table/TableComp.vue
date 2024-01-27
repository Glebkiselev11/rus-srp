<script lang="ts">
import { defineComponent, type PropType } from "vue";
import TableColumnTitleComp from "./TableColumnTitleComp.vue";
import type { Order } from "../../types/api";
import type { TableColumn } from "@/types/table";
import { vInfiniteScroll } from "@vueuse/components";
import type { UseInfiniteScrollOptions } from "@vueuse/core";

export default defineComponent({
	name: "TableComp",
	directives: {
		infiniteScroll: vInfiniteScroll,
	},
	components: {
		TableColumnTitleComp,
	},
	props: {
		columns: {
			type: Array as PropType<TableColumn[]>,
			default: () => [],
		},
		gridTemplateColumns: {
			type: String,
			required: true,
		},
		order: {
			type: String as PropType<Order>,
			default: null,
		},
		infiniteScrollConfig: {
			type: Object as PropType<UseInfiniteScrollOptions>,
			default: () => ({
				// it will disable the interval for the case when we don't need to infinite scroll
				interval: 9999999,
			}),
		},
		bodyHeight: {
			type: String,
			default: "calc(100vh - 270px)",
		},
	},

	emits: ["update:order", "scrollToBottom"],
	data() {
		return {
			isContentBodyScrollable: null as boolean | null,
		};
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
		handleScrollToBottom() {
			this.$emit("scrollToBottom");
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
				<tr :style="{ gridTemplateColumns }">
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
				v-infinite-scroll="[handleScrollToBottom, infiniteScrollConfig]"
				:style="{ height: bodyHeight }"
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

.table-wrap {
	border: 1px solid $color-separator-primary;
	border-radius: 8px;
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
		position: relative;

		tr:last-child {
			border-block-end: none;
		}
	}
}

</style>
