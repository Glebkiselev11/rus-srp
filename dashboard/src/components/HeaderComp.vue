<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ButtonComp from "./ButtonComp.vue";

type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5";

export default defineComponent({
	name: "HeaderComp",
	components: {
		ButtonComp,
	},
	props: {
		title: {
			type: String,
			default: null,
		},
		titleTag: {
			type: String as PropType<TitleTag>,
			default: "h3",
		},
		paddingInline: {
			type: String,
			default: "16px",
		},
		subtitle: {
			type: String,
			default: null,
		},
		closeButton: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close"],
	methods: {
		close(e: Event): void {
			this.$emit("close", e);
		},
	},
});
</script>

<template>
	<header
		class="header"
		:style="{paddingInline}"
	>
		<div class="header__part-container">
			<slot name="left" />
			<div>
				<component
					:is="titleTag"
					v-if="title"
				>
					{{ title }}
				</component>

				<span
					v-if="subtitle"
					class="header__subtitle"
					v-text="subtitle"
				/>
			</div>
		</div>

		<div class="header__part-container">
			<slot name="right" />

			<ButtonComp
				v-if="closeButton"
				icon="close"
				appearance="inline"
				color="neutral"
				class="header__close-button"
				@click.stop="close"
			/>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.header {
	width: 100%;
	min-height: 48px;
	padding-block: 12px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&__part-container {
		display: flex;
		align-items: center;
		column-gap: 16px;
	}

	&__close-button {
		margin-inline-start: 16px;
	}

	&__subtitle {
		@include text-body-2;
		color: $color-text-secondary;
	}
}

</style>
