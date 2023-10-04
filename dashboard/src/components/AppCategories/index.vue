<!-- The side bar with categories -->
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppCategories",
});

</script>

<template>
	<div class="app-categories">
		<h5>
			AppCategories
		</h5>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-categories {
  padding: 12px;
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;
}

</style>