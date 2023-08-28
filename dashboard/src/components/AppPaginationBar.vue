<script lang="ts">
import { defineComponent } from "vue"; 
import AppSelect from "@/components/AppSelect.vue";
import AppInput from "@/components/AppInput.vue";

export default defineComponent({
	name: "AppPaginationBar",
	components: {
		AppSelect,
		AppInput,
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
	},
	emits: ["update:limit", "update:offset"],
	data() {
		return {
			limitOptions: [
				{ value: 25, label: "25" },
				{ value: 50, label: "50" },
				{ value: 100, label: "100" },
			],
		};
	},
	computed: {
		currentRange(): string {
			return `${this.offset + 1}-${this.offset + this.limit}`;
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
			this.$emit("update:offset", (value - 1) * this.limit);
		},
	},
});
</script>

<template>
	<div class="app-pagination-bar">
		<div class="app-pagination-bar--section">
			<div class="count-info">
				{{ $t("pagination.info", { currentRange, count }) }}
			</div>

			<div class="limit-controller">
				<span class="limit-controller--text">{{ $t("pagination.show") }}</span>
				<AppSelect
					:model-value="limit"
					:options="limitOptions"
					@update:model-value="updateLimit"
				/>
			</div>
		</div>

		<div class="app-pagination-bar--section">
			<div class="select-page-controller">
				<span class="select-page-controller--text">
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


	&--section {
		display: flex;
		align-items: center;
	}


	.count-info {
		@extend .text-subtitle-2;
		color: $color-text-secondary;
		margin-inline-end: 24px;
	}

	.limit-controller {
		display: flex;

		&--text {
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