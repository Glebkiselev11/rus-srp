<script lang="ts">
import type { Id } from "@/types/api";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "TableRowComp",
	props: {
		checkable: {
			type: Boolean,
			default: false,
		},
		id: {
			type: [String, Number] as PropType<Id>,
			default: null,
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
			if (this.id === null) return console.warn("TableRow: id is null. Cannot emit event");

			if (checked) {
				this.$emit("checked", this.id);
			} else {
				this.$emit("unchecked", this.id);
			}
		},
	},
});

</script>

<template>
	<tr class="table-row">
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
.table-row {
  height: 72px;

  td {
    padding-inline: 16px;
  }
}

</style>
