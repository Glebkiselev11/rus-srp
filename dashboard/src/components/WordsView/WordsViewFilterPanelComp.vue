<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Order, TranslationApprovedStatus } from "@/types/api";
import InputComp from "@/components/InputComp.vue";
import SelectComp from "@/components/SelectComp.vue";
import SwitchComp from "@/components/SwitchComp.vue";

export default defineComponent({
	name: "WordsViewFilterPanelComp",
	components: {
		InputComp,
		SelectComp,
		SwitchComp,
	},
	props: {
		search: {
			type: String,
			default: "",
		},
		order: {
			type: String as PropType<Order>,
			default: "",
		},
		orderOptions: {
			type: Array as PropType<{ value: string, label: string }[]>,
			required: true,
		},
		translationApprovedStatus: {
			type: String as PropType<TranslationApprovedStatus>,
			required: true,
		},
	},
	emits: ["update:search", "update:order", "update:translationApprovedStatus"],
	computed: {
		switcherValue: {
			get(): boolean {
				return this.translationApprovedStatus === "exclude_approved";
			},
			set(newValue: boolean) {
				this.$emit("update:translationApprovedStatus", newValue ? "exclude_approved" : "all");
			},

		},
	},
	methods: {
		updateSearch(newSearch: string) {
			this.$emit("update:search", newSearch);
		},
		updateOrder(newOrder: Order) {
			this.$emit("update:order", newOrder);
		},
	},

});

</script>

<template>
	<div class="filter-panel">
		<InputComp
			:model-value="search"
			type="text"
			:placeholder="$t('find-word')"
			left-icon="search"
			debounce
			width="360px"
			@update:model-value="updateSearch"
		/>	

		<div class="filter-panel__right">
			<div class="unconfirmed-switcher">
				<div class="unconfirmed-switcher__indicator" />
				<span v-text="$t('only-unconfirmed')" />
				<SwitchComp 
					v-model="switcherValue"
				/>
			</div>
			<SelectComp
				:model-value="order"
				:options="orderOptions"
				appearance="inline"
				icon="sort"
				size="compact"
				:placeholder="$t('to-sort')"
				compact
				@update:model-value="updateOrder"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.filter-panel {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-block-end: 16px;

	&__right {
		display: flex;
		align-items: center;
		gap: 16px;

		.unconfirmed-switcher {
			display: flex;
			align-items: center;
			gap: 10px;

			&__indicator {
				width: 4px;
				height: 16px;
				background-color: $color-background-negative;
			}
		}
	}
}

</style>
