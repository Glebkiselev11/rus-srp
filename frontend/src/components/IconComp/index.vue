<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { type Component, computed } from "vue";
import type { IconColor, IconName, IconSize } from "../../types/icons";

import AdminPanelSettingsIcon from "./AdminPanelSettingsIcon.vue";
import ListIcon from "./ListIcon.vue";
import SettingsIcon from "./SettingsIcon.vue";
import SearchIcon from "./SearchIcon.vue";
import TranslateIcon from "./TranslateIcon.vue";
import ImageIcon from "./ImageIcon.vue";
import ExpandAllIcon from "./ExpandAllIcon.vue";
import FilterHdrIcon from "./FilterHdrIcon.vue";
import ArrowDownwardAltIcon from "./ArrowDownwardAltIcon.vue";
import ArrowUpwardAltIcon from "./ArrowUpwardAltIcon.vue";
import AddIcon from "./AddIcon.vue";
import MoreVertIcon from "./MoreVertIcon.vue";
import EditIcon from "./EditIcon.vue";
import DeleteIcon from "./DeleteIcon.vue";
import NavigateBeforeIcon from "./NavigateBeforeIcon.vue";
import NavigateNextIcon from "./NavigateNextIcon.vue";
import AddPhotoAlternateIcon from "./AddPhotoAlternateIcon.vue";
import CloseIcon from "./CloseIcon.vue";
import CheckCircleIcon from "./CheckCircleIcon.vue";
import ManageSearchIcon from "./ManageSearchIcon.vue";
import CancelIcon from "./CancelIcon.vue";
import ExpandMoreDownIcon from "./ExpandMoreDownIcon.vue";
import ExpandMoreUpIcon from "./ExpandMoreUpIcon.vue";
import SortIcon from "./SortIcon.vue";
import WidgetsIcon from "./WidgetsIcon.vue";
import DoneIcon from "./DoneIcon.vue";
import EditNoteIcon from "./EditNoteIcon.vue";
import ErrorIcon from "./ErrorIcon.vue";
import RestartAltIcon from "./RestartAltIcon.vue";
import RemoveIcon from "./RemoveIcon.vue";
import IndeterminateCheckboxIcon from "./IndeterminateCheckboxIcon.vue";
import CheckboxIcon from "./CheckboxIcon.vue";
import CheckboxOutlineBlankIcon from "./CheckboxOutlineBlankIcon.vue";
import LogoutIcon from "./LogoutIcon.vue";
import MarkStatusIcon from "./MarkStatusIcon.vue";

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
  return {
    admin_panel_settings: AdminPanelSettingsIcon,
    list: ListIcon,
    settings: SettingsIcon,
    search: SearchIcon,
    translate: TranslateIcon,
    image: ImageIcon,
    expand_all: ExpandAllIcon,
    filter_hdr: FilterHdrIcon,
    arrow_downward_alt: ArrowDownwardAltIcon,
    arrow_upward_alt: ArrowUpwardAltIcon,
    add: AddIcon,
    more_vert: MoreVertIcon,
    edit: EditIcon,
    delete: DeleteIcon,
    navigate_before: NavigateBeforeIcon,
    navigate_next: NavigateNextIcon,
    add_photo_alternate: AddPhotoAlternateIcon,
    close: CloseIcon,
    check_circle: CheckCircleIcon,
    manage_search: ManageSearchIcon,
    cancel: CancelIcon,
    expand_more_down: ExpandMoreDownIcon,
    expand_more_up: ExpandMoreUpIcon,
    sort: SortIcon,
    widgets: WidgetsIcon,
    done: DoneIcon,
    edit_note: EditNoteIcon,
    error: ErrorIcon,
    restart_alt: RestartAltIcon,
    remove: RemoveIcon,
    indeterminate_checkbox: IndeterminateCheckboxIcon,
    checkbox: CheckboxIcon,
    checkbox_outline_blank: CheckboxOutlineBlankIcon,
    logout: LogoutIcon,
    mark_status: MarkStatusIcon,
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
