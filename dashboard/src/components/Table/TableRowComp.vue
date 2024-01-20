<script lang="ts">
import type { Id } from "@/types/api";
import { vElementHover } from "@vueuse/components";
import { defineComponent, type PropType } from "vue";
import CheckboxComp from "../CheckboxComp.vue";
import type { Checkbox } from "@/types";

export default defineComponent({
	name: "TableRowComp",
	components: {
		CheckboxComp,
	},
	directives: {
		elementHover: vElementHover,
	},
	props: {
		checkable: {
			type: Boolean,
			default: false,
		},
		id: {
			type: [String, Number] as PropType<Id>,
			default: null,
		},
		gridTemplateColumns: {
			type: String,
			required: true,
		},
		checkbox: {
			type: Object as PropType<Checkbox>,
			default: () => ({
				checked: false,
				indeterminated: false,
				disabled: false,
			}),
		},
	},
	emits: ["checked:update", "unchecked", "hover"],
	computed: {
		gridTemplateColumnsWithCheckbox() {
			return this.checkable ? `48px ${this.gridTemplateColumns}` : this.gridTemplateColumns;
		},
	},
	methods: {
		onHover(x: boolean) {
			this.$emit("hover", x);
		},
		updateChecked(x: boolean) {
			this.$emit("checked:update", x);
		},
	},
});
</script>

<template>
	<tr
		v-element-hover="onHover"
		class="table-row"
		:style="{ gridTemplateColumns: gridTemplateColumnsWithCheckbox }"
	>
		<td
			v-if="checkable"
			class="table-row__checkbox-wrap"
		>
			<CheckboxComp
				:model-value="checkbox.checked"
				:disabled="checkbox.disabled"
				:indeterminated="checkbox.indeterminated"
				@update:model-value="updateChecked"
			/>
		</td>
		<slot />
	</tr>
</template>

<style lang="scss">
@import "@/styles/main.scss";

.table-row {
	height: 72px;
	display: grid;
	align-items: center;
	border-block-end: 1px solid $color-separator-primary;

	td {
		padding-inline: 16px;
	}

	&__checkbox-wrap {
		padding-inline: 4px!important;
	}
}

</style>
