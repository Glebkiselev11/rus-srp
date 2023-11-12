<script lang="ts">
import { defineComponent } from "vue";
import ButtonComp from "./ButtonComp.vue";
import AppPaginationButton from "./AppPaginationButton.vue";

const BEFORE_AND_AFTER_ELLIPSIS = 2;

export default defineComponent({
	name: "AppPagination",
	components: {
		ButtonComp,
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
		isSmallList() {
			return this.lastPage <= 3 + BEFORE_AND_AFTER_ELLIPSIS * 2;
		},
		middleNumbers(): number[] {
			// Here we establish buttons near current button.
			// For example current is 15 and last page is 20:
			// it will looks like [1]...[13][14][15][16][17]...[20]
			return this.isSmallList
				? this.getRange(2, this.lastPage - 2)
				: this.getRange(
					this.currentPage - BEFORE_AND_AFTER_ELLIPSIS,
					1 + BEFORE_AND_AFTER_ELLIPSIS * 2,
				).filter(page => page > 1 && page < this.lastPage);
		},
		ellipsisBeforeMiddle() {
			return this.currentPage > 4 && !this.isSmallList;
		},
		ellipsisAfterMiddle() {
			return this.currentPage < this.lastPage - 3 && !this.isSmallList;
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
		getRange(start: number, length: number) {
			return length > 0
				? [...Array(length).keys()].map(val => val + start)
				: [];
		},
	},
});

</script>

<template>
	<div class="app-pagination">
		<ButtonComp
			icon="navigate_before"
			:disabled="currentPage === 1"
			appearance="inline"
			size="compact"
			color="neutral"
			@click="prevPage"
		/>

		<div class="app-pagination__pages">
			<AppPaginationButton
				label="1"
				:active="isCurrentPage(1)"
				@click="changePage(1)"
			/>

			<span
				v-show="ellipsisBeforeMiddle"
				class="app-pagination__ellipses"
			>
				...
			</span>

			<AppPaginationButton 
				v-for="page in middleNumbers"
				:key="page"
				:label="page.toString()"
				:active="isCurrentPage(page)"
				@click="changePage(page)"
			/>

			<span
				v-show="ellipsisAfterMiddle"
				class="app-pagination__ellipses"
			>
				...
			</span>

			<AppPaginationButton
				:label="lastPage.toString()"
				:active="isCurrentPage(lastPage)"
				@click="changePage(lastPage)"
			/>
		</div>

		<ButtonComp
			icon="navigate_next"
			:disabled="currentPage === lastPage"
			appearance="inline"
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

	&__pages {
		display: inherit;
		align-items: flex-end;
	}

	&__ellipses {
		width: 32px;
		text-align: center;
		padding-block-end: 6px;
		pointer-events: none;
	}
}

</style>
