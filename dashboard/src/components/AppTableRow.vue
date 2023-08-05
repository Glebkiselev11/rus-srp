<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppTableRow",
	props: {
		checkable: {
			type: Boolean,
			default: false,
		},
		id: {
			type: Number,
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
			if (this.id === null) return console.warn("AppTableRow: id is null. Cannot emit event");

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
	<tr>
		<td v-if="checkable">
			<input
				v-model="checked"
				type="checkbox"
			>
		</td>
		<slot />
	</tr>
</template>