<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { type Component, computed, defineAsyncComponent } from "vue";
import type { IconColor, IconName, IconSize } from "../../types/icons";

type Props = {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
};

const props = withDefaults(defineProps<Props>(), {
  size: "regular",
  color: "primary",
});

const icon = computed((): Component => {
  const x = defineAsyncComponent;

  return {
    admin_panel_settings: x(() => import("./AdminPanelSettingsIcon.vue")),
    list: x(() => import("./ListIcon.vue")),
    settings: x(() => import("./SettingsIcon.vue")),
    search: x(() => import("./SearchIcon.vue")),
    translate: x(() => import("./TranslateIcon.vue")),
    image: x(() => import("./ImageIcon.vue")),
    expand_all: x(() => import("./ExpandAllIcon.vue")),
    filter_hdr: x(() => import("./FilterHdrIcon.vue")),
    arrow_downward_alt: x(() => import("./ArrowDownwardAltIcon.vue")),
    arrow_upward_alt: x(() => import("./ArrowUpwardAltIcon.vue")),
    add: x(() => import("./AddIcon.vue")),
    more_vert: x(() => import("./MoreVertIcon.vue")),
    edit: x(() => import("./EditIcon.vue")),
    delete: x(() => import("./DeleteIcon.vue")),
    navigate_before: x(() => import("./NavigateBeforeIcon.vue")),
    navigate_next: x(() => import("./NavigateNextIcon.vue")),
    add_photo_alternate: x(() => import("./AddPhotoAlternateIcon.vue")),
    close: x(() => import("./CloseIcon.vue")),
    check_circle: x(() => import("./CheckCircleIcon.vue")),
    manage_search: x(() => import("./ManageSearchIcon.vue")),
    cancel: x(() => import("./CancelIcon.vue")),
    expand_more_down: x(() => import("./ExpandMoreDownIcon.vue")),
    expand_more_up: x(() => import("./ExpandMoreUpIcon.vue")),
    sort: x(() => import("./SortIcon.vue")),
    widgets: x(() => import("./WidgetsIcon.vue")),
    done: x(() => import("./DoneIcon.vue")),
    edit_note: x(() => import("./EditNoteIcon.vue")),
    error: x(() => import("./ErrorIcon.vue")),
    restart_alt: x(() => import("./RestartAltIcon.vue")),
    remove: x(() => import("./RemoveIcon.vue")),
    indeterminate_checkbox: x(() => import("./IndeterminateCheckboxIcon.vue")),
    checkbox: x(() => import("./CheckboxIcon.vue")),
    checkbox_outline_blank: x(() => import("./CheckboxOutlineBlankIcon.vue")),
    logout: x(() => import("./LogoutIcon.vue")),
    mark_status: x(() => import("./MarkStatusIcon.vue")),
  }[props.name];
});

const convertedSize = computed(() => {
  return {
    small: "16px",
    compact: "20px",
    regular: "24px",
  }[props.size];
});
</script>

<template>
  <component
    :is="icon"
    :class="[`icon--${props.color}`]"
    :width="convertedSize"
  />
</template>

<style lang="scss">
@import "@/styles/colors";

.icon {
  &--primary {
    fill: $color-icon-primary;
  }

  &--secondary {
    fill: $color-icon-secondary;
  }

  &--tertiary {
    fill: $color-icon-tertiary;
  }

  &--contrast {
    fill: $color-icon-contrast;
  }

  &--accent-primary {
    fill: $color-icon-accent-primary;
  }

  &--accent-secondary {
    fill: $color-icon-accent-secondary;
  }

  &--positive {
    fill: $color-icon-positive;
  }

  &--negative {
    fill: $color-icon-negative;
  }

  &--warning {
    fill: $color-icon-warning;
  }

  &--link {
    fill: $color-icon-link;
  }

  &--disabled {
    fill: $color-icon-disabled;
  }

  &--placeholder {
    fill: $color-icon-placeholder;
  }

  &--transparent {
    fill: transparent;
  }

  &--current-color {
    fill: currentcolor;
  }
}
</style>
