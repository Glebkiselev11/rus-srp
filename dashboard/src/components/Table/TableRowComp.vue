<script lang="ts">
import type { Id } from "@/types/api";
import { vElementHover } from "@vueuse/components";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "TableRowComp",
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
	},
	emits: ["checked", "unchecked", "hover"],
	data() {
		return {
			checked: false,
		};
	},
	watch: {
		checked(checked: boolean) {
			if (this.id === null) return console.warn("TableRow: id is null. Cannot emit event");

			if (checked) {
				this.$emit("checked", this.id);
			} else {
				this.$emit("unchecked", this.id);
			}
		},
	},
	methods: {
		onHover(x: boolean) {
			this.$emit("hover", x);
		},
	},
});
</script>

<template>
	<tr
		v-element-hover="onHover"
		class="table-row"
		:style="{ gridTemplateColumns }"
	>
		<td v-if="checkable">
			<input
				v-model="checked"
				type="checkbox"
			>
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
}

</style>
