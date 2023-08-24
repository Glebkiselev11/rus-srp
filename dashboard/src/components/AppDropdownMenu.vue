<script lang="ts">
import type { IconColor, IconName } from "@/types/icons";
import { defineComponent, type PropType } from "vue"; 
import AppListItem from "./AppListItem.vue";
import { vOnClickOutside, vElementVisibility } from "@vueuse/components";
import { watchDebounced } from "@vueuse/core";
import AppIcon from "@/components/AppIcon/index.vue";

interface MenuItem {
	label: string;
	icon?: IconName;
	color?: IconColor;
	handler: () => void;
}

type Separator = "separator";

type MenuPosition = "bottom" | "top";

export default defineComponent({
	name: "AppDropdownMenu",
	directives: {
		onClickOutside: vOnClickOutside,
		elementVisibility: vElementVisibility,
	},
	components: {
		AppListItem,
		AppIcon,
	},
	props: {
		items: {
			type: Array as PropType<Array<MenuItem | Separator>>,
			required: true,
		},
	},
	data() {
		return {
			isMenuOpen: false,
			isBottomMenuVisible: null as boolean | null,
			menuPosition: "bottom" as MenuPosition,
		};
	},
	mounted() {
		watchDebounced(
			() => this.isBottomMenuVisible,
			(visible) => {
				if (!visible && this.isMenuOpen) {
					this.menuPosition = "top";
				}
			},
			{ debounce: 10 },
		);
	},
	methods: {
		toggleMenu() {
			this.isMenuOpen = !this.isMenuOpen;
		},
		closeMenu() {
			if (!this.isMenuOpen) return;
			this.isMenuOpen = false;
			this.menuPosition = "bottom";
		},
		setBottomMenuAngleVisibility(state: boolean) {
			this.isBottomMenuVisible = state;
		},
		handdleClickOnItem(handler: () => void) {
			handler();
			this.closeMenu();
		},
	},
});
</script>

<template>
	<div
		v-on-click-outside="closeMenu"
		class="app-dropdown"
	>
		<div @click="toggleMenu">
			<slot />
		</div>

		<div
			v-if="isMenuOpen"
			class="app-dropdown--menu"
			:class="[`app-dropdown--menu-position-${menuPosition}`]"
		>
			<template
				v-for="(item, i) in items"
				:key="i"
			>
				<template v-if="item === 'separator'">
					<hr>
				</template>

				<AppListItem
					v-else
					clickable
					@click="item.handler"
				>
					<template #left>
						<AppIcon
							v-if="item.icon"
							:name="item.icon"
							:color="item.color"
						/>

						<span
							:class="[`text-color-${item.color}`]"
							v-text="item.label"
						/>
					</template>
				</AppListItem>
			</template>

			<div
				v-element-visibility="setBottomMenuAngleVisibility"
				class="app-dropdown--mark-bottom"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-dropdown {
	position: relative;

	&--menu {
		padding-block: 8px;
		position: absolute;
		right: 0;
		background-color: $color-background-content-primary;
		border-radius: 12px;
		z-index: 9999;
		border: 1px solid $color-separator-primary;
		box-shadow: 0px 0px 4px 0px rgba(2, 18, 38, 0.08), 0px 4px 8px 0px rgba(2, 18, 38, 0.04);

		&-position-top {
			bottom: 100%;
		}

		&-position-bottom {
			top: 100%;
		}
	}

	&--mark-bottom {
		position: absolute;
		bottom: 0;
		left: 0;
	}
}

</style>