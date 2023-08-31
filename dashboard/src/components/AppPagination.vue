<script lang="ts">
import { defineComponent } from "vue";
import AppButton from "./AppButton.vue";

export default defineComponent({
	name: "AppPagination",
	components: {
		AppButton,
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
	},
});

</script>

<template>
	<div class="app-pagination">
		<AppButton
			v-for="page in pageCounts"
			:key="page"
			:label="page.toString()"
			:type="isCurrentPage(page) ? 'secondary' : 'inline'"
			:color="isCurrentPage(page) ? 'accent-primary' : 'neutral'"
			@click="changePage(page)"
		/>
	</div>
</template>

<style scoped lang="scss">

.app-pagination {
	display: flex;
	justify-content: center;
	align-items: center;
}

</style>