<script lang="ts">
import { defineComponent, type PropType } from "vue"; 
import AppSelect from "@/components/AppSelect.vue";
import AppInput from "@/components/AppInput.vue";
import AppPagination from "./AppPagination.vue";

export default defineComponent({
	name: "AppPaginationBar",
	components: {
		AppSelect,
		AppInput,
		AppPagination,
	},
	props: {
		count: {
			type: Number,
			required: true,
		},
		offset: {
			type: Number,
			required: true,
		},
		limit: {
			type: Number,
			required: true,
		},
		limitOptions: {
			type: Array as PropType<{ value: number, label: string }[]>,
			required: true,
		},
	},
	emits: ["update:limit", "update:offset"],
	computed: {
		currentRange(): string {
			const last = this.offset + this.limit;
			if (last > this.count) return `${this.offset + 1}-${this.count}`;

			return `${this.offset + 1}-${last}`;
		},
		currentPage(): number {
			return Math.ceil(this.offset / this.limit) + 1;
		},
		lastPage(): number {
			return Math.ceil(this.count / this.limit);
		},
	},
	methods: {
		updateLimit(value: number) {
			this.$emit("update:limit", value);
		},
		changePage(value: number) {
			this.updateOffset((value - 1) * this.limit);
		},
		updateOffset(value: number) {
			this.$emit("update:offset", value);
		},
	},
});
</script>

<template>
	<div class="app-pagination-bar">
		<div class="app-pagination-bar__section">
			<div class="count-info">
				{{ $t("pagination.info", { currentRange, count }) }}
			</div>

			<div class="limit-controller">
				<span class="limit-controller__text">{{ $t("pagination.show") }}</span>
				<AppSelect
					:model-value="limit"
					:options="limitOptions"
					size="compact"
					appearance="filled"
					@update:model-value="updateLimit"
				/>
			</div>
		</div>

		<div class="app-pagination-bar__section">
			<div class="select-page-controller">
				<span class="select-page-controller__text">
					{{ $t("pagination.select-page") }}
				</span>

				<AppInput
					type="number"
					:model-value="currentPage"
					:min="1"
					:max="lastPage"
					:debounce="true"
					width="56px" 
					size="compact"
					@update:model-value="changePage"
				/>
			</div>

			<AppPagination
				:limit="limit"
				:offset="offset"
				:count="count"
				@update:offset="updateOffset"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding-inline: 24px;
  border-block-start: 1px solid $color-separator-primary;
  background-color: $color-background-content-primary;

	&__section {
		display: flex;
		align-items: center;
		column-gap: 24px;
	}

	.count-info {
		@extend .text-subtitle-2;
		color: $color-text-secondary;
	}

	.limit-controller {
		display: flex;
		align-items: center;

		&__text {
			@extend .text-body-2;
			color: $color-text-secondary;
			margin-inline-end: 8px;
		}
	}

	.select-page-controller {
		display: flex;
		align-items: center;

		&--text {
			@extend .text-body-2;
			color: $color-text-secondary;
			margin-inline-end: 8px;
		}
	}
}

</style> 
