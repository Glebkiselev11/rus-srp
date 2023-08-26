<script lang="ts">
import { defineComponent } from "vue"; 

export default defineComponent({
	name: "AppTablePagination",
});

</script>

<template>
	<div class="app-table-pagination">
		here we go
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-table-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 64px;
  padding-inline: 24px;
  border-block-start: 1px solid $color-separator-primary;
  background-color: $color-background-content-primary;

}

</style>