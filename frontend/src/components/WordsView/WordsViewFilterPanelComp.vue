<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Id, Order, TranslationApprovedStatus } from "@/types/api";
import InputComp from "@/components/InputComp.vue";
import SelectComp from "@/components/SelectComp.vue";
import SwitchComp from "@/components/SwitchComp.vue";

export default defineComponent({
  name: "WordsViewFilterPanelComp",
  components: {
    InputComp,
    SelectComp,
    SwitchComp,
  },
  props: {
    search: {
      type: String,
      default: "",
    },
    order: {
      type: String as PropType<Order>,
      default: "",
    },
    translationApprovedStatus: {
      type: String as PropType<TranslationApprovedStatus>,
      required: true,
    },
    categoryId: {
      type: Number as PropType<Id>,
      default: null,
    },
  },
  emits: ["update:search", "update:order", "update:translationApprovedStatus"],
  data() {
    return {
      orderOptions: [
        { value: "-created_at", label: this.$t("order.last-added") },
        { value: "-updated_at", label: this.$t("order.last-updated") },
      ],
    };
  },
  computed: {
    switcherValue: {
      get(): boolean {
        return this.translationApprovedStatus === "exclude_approved";
      },
      set(newValue: boolean) {
        this.$emit(
          "update:translationApprovedStatus",
          newValue ? "exclude_approved" : "all"
        );
      },
    },
    searchPlaceholder(): string {
      return this.categoryId
        ? this.$t("search-in-category-words")
        : this.$t("search-in-all-words");
    },
  },
  methods: {
    updateSearch(newSearch: string) {
      this.$emit("update:search", newSearch);
    },
    updateOrder(newOrder: Order) {
      this.$emit("update:order", newOrder);
    },
  },
});
</script>

<template>
  <div class="filter-panel">
    <InputComp
      :model-value="search"
      appearance="outline"
      type="text"
      :placeholder="searchPlaceholder"
      left-icon="search"
      debounce
      width="360px"
      clear-button
      @update:model-value="updateSearch"
    />

    <div class="filter-panel__right">
      <div class="unconfirmed-switcher">
        <div class="unconfirmed-switcher__indicator" />
        <span v-text="$t('only-unconfirmed')" />
        <SwitchComp v-model="switcherValue" />
      </div>
      <SelectComp
        :model-value="order"
        :options="orderOptions"
        appearance="inline"
        icon="sort"
        size="compact"
        :placeholder="$t('to-sort')"
        compact
        @update:model-value="updateOrder"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.filter-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 16px;

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;

    .unconfirmed-switcher {
      display: flex;
      align-items: center;
      gap: 10px;

      &__indicator {
        width: 4px;
        height: 16px;
        background-color: $color-background-negative;
      }
    }
  }
}
</style>
