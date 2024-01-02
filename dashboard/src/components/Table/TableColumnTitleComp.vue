<script lang="ts">
import type { IconColor, IconName } from "../../types/icons";
import { defineComponent, type PropType } from "vue";
import IconComp from "../IconComp/index.vue";
import type { Order } from "../../types/api";

export default defineComponent({
	name: "TableColumnTitleComp",
	components: {
		IconComp,
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
		order: {
			type: String as PropType<Order>,
			default: null,
		},
		sortKey: {
			type: String as PropType<string>,
			default: null,
		},
	},
	emits: ["update:order"],
	computed: {
		sortIcon(): IconName {
			if (this.order === this.sortKey) return "arrow_downward_alt";
			if (this.order === `-${this.sortKey}`) return "arrow_upward_alt";
			return "expand_all";
		},
		sortIconColor(): IconColor {
			if (this.sortActive) return "accent-primary";
			return "tertiary";
		},
		sortActive(): boolean {
			return this.order === this.sortKey || this.order === `-${this.sortKey}`;
		},

	},
	methods: {
		handlerSort() {
			if (!this.sortable || !this.sortKey) return;

			if (this.order !== this.sortKey && this.order !== `-${this.sortKey}`) {
				this.$emit("update:order", this.sortKey);
			} else if (this.order === this.sortKey) {
				this.$emit("update:order", `-${this.sortKey}`);
			} else {
				this.$emit("update:order", undefined);
			}
		},
	},
});

</script>

<template>
	<th :style="{ width }">
		<div class="table-column-title__outer">
			<button 
				class="table-column-title"
				:class="{ 'table-column-title--sortable': sortable }"
				:disabled="!sortable"
				@click="handlerSort"
			>
				<IconComp
					v-if="icon"
					:name="icon.name"
					:color="icon.color"
				/>
				<span
					v-if="label"
					class="table-column-title__label"
					:class="{ 'table-column-title__label--active-sort': sortActive }"
					v-text="label"
				/>

				<IconComp
					v-if="sortable"
					:name="sortIcon"
					:color="sortIconColor"
					size="compact"
				/>
			</button>
		</div>
	</th>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

$padding: 8px;

.table-column-title__outer {
	display: flex;
	justify-content: flex-start;
	margin-inline-start: -$padding;
}

.table-column-title {
  display: flex;
  align-items: center;
  column-gap: 4px;
	border-radius: 8px;
	padding: $padding;
	border: none;
	background: transparent;

  &--sortable {
    cursor: pointer;
		&:hover {
			background-color: $color-background-content-primary-hovered;
		}
  }

  &__label {
		@include text-body-2;
    color: $color-text-secondary;

		&--active-sort {
			color: $color-text-accent-primary;
		}
  }
}

</style>
