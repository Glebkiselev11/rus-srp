<script lang="ts">
import { defineComponent, type PropType } from "vue";

interface Column {
  label: string;
	sortable: boolean;
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
	emits: ["checked", "unchecked"],
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
					<th
						v-for="col in columns"
						:key="col.label"
						:style="{ width: col.width ?? 'auto' }"
					>
						{{ col.label }}
					</th>
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