<script lang="ts">
import type { IconColor, IconName } from "@/types/icons";
import { defineComponent, type PropType } from "vue"; 
import AppListItem from "./AppListItem.vue";
import { vOnClickOutside } from "@vueuse/components";
import AppIcon from "@/components/AppIcon/index.vue";

interface MenuItem {
	label: string;
	icon?: IconName;
	color?: IconColor;
	handler: () => void;
}

type Separator = "separator";

export default defineComponent({
	name: "AppDropdownMenu",
	directives: {
		onClickOutside: vOnClickOutside,
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
		};
	},
	methods: {
		toggleMenu() {
			this.isMenuOpen = !this.isMenuOpen;
		},
		closeMenu() {
			this.isMenuOpen = false;
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
		top: 100%;
		right: 0;
		background-color: $color-background-content-primary;
		border-radius: 12px;
		z-index: 1;
		border: 1px solid $color-separator-primary;
		box-shadow: 0px 0px 4px 0px rgba(2, 18, 38, 0.08), 0px 4px 8px 0px rgba(2, 18, 38, 0.04);
	}
}

</style>