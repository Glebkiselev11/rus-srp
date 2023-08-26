<script lang="ts">
import { defineComponent } from "vue"; 

export default defineComponent({
	name: "AppTablePagination",
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
	computed: {
		currentRange(): string {
			return `${this.offset + 1}-${this.offset + this.limit}`;
		},
	},
});

</script>

<template>
	<div class="app-table-pagination">
		<div>
			<div class="count-info">
				{{ $t("pagination.info", { currentRange, count }) }}
			</div>
		</div>

		<div>here we go</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding-inline: 24px;
  border-block-start: 1px solid $color-separator-primary;
  background-color: $color-background-content-primary;


	.count-info {
		@extend .text-body-2;
		color: $color-text-secondary;
	}
}

</style>