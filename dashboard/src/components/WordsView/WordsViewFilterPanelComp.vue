<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Order } from "@/types/api";
import InputComp from "@/components/InputComp.vue";
import SelectComp from "@/components/SelectComp.vue";

export default defineComponent({
	name: "WordsViewFilterPanelComp",
	components: {
		InputComp,
		SelectComp,
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
	},
	emits: ["update:search", "update:order"],
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
	<div class="words-view-filter-panel-comp">
		<InputComp
			:model-value="search"
			type="text"
			:placeholder="$t('find-word')"
			left-icon="search"
			debounce
			width="360px"
			@update:model-value="updateSearch"
		/>	

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
</template>

<style lang="scss" scoped>

.words-view-filter-panel-comp {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-block-end: 16px;
}

</style>
