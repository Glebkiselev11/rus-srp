<script lang="ts">
import { defineComponent } from "vue";
import AppButton from "./AppButton.vue";
import AppPaginationButton from "./AppPaginationButton.vue";

export default defineComponent({
	name: "AppPagination",
	components: {
		AppButton,
		AppPaginationButton,
	},
	props: {
		limit: {
			type: Number,
			required: true,
		},
		offset: {
			type: Number,
			required: true,
		},
		count: {
			type: Number,
			required: true,
		},
	},
	emits: ["update:offset"],
	computed: {
		currentPage(): number {
			return Math.ceil(this.offset / this.limit) + 1;
		},
		lastPage(): number {
			return Math.ceil(this.count / this.limit);
		},
		pageCounts(): number[] {
			const pages = [];
			for (let i = 1; i <= this.lastPage; i++) {
				pages.push(i);
			}
			return pages;
		},
	},
	methods: {
		isCurrentPage(page: number): boolean {
			return page === this.currentPage;
		},
		changePage(page: number) {
			this.updateOffset((page - 1) * this.limit);
		},
		updateOffset(value: number) {
			this.$emit("update:offset", value);
		},
		prevPage() {
			this.changePage(this.currentPage - 1);
		},
		nextPage() {
			this.changePage(this.currentPage + 1);
		},
	},
});

</script>

<template>
	<div class="app-pagination">
		<AppButton
			icon="navigate_before"
			:disabled="currentPage === 1"
			type="inline"
			size="compact"
			color="neutral"
			@click="prevPage"
		/>

		<div class="app-pagination--pages">
			<AppPaginationButton
				label="1"
				:active="isCurrentPage(1)"
				@click="changePage(1)"
			/>

			<span class="app-pagination--ellipses">
				...
			</span>

			<AppPaginationButton 
				v-for="page in pageCounts"
				:key="page"
				:label="page.toString()"
				:active="isCurrentPage(page)"
				@click="changePage(page)"
			/>

			<span class="app-pagination--ellipses">
				...
			</span>

			<AppPaginationButton
				:label="lastPage.toString()"
				:active="isCurrentPage(lastPage)"
				@click="changePage(lastPage)"
			/>
		</div>

		<AppButton
			icon="navigate_next"
			:disabled="currentPage === lastPage"
			type="inline"
			size="compact"
			color="neutral"
			@click="nextPage"
		/>
	</div>
</template>

<style scoped lang="scss">

.app-pagination {
	display: flex;
	column-gap: 8px;

	&--pages {
		display: inherit;
		align-items: flex-end;
	}

	&--ellipses {
		width: 32px;
		text-align: center;
		padding-block-end: 6px;
		pointer-events: none;
	}
}

</style>