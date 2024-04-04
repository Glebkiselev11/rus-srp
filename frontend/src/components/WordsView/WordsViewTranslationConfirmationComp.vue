<script lang="ts">
import { defineComponent } from "vue";
import ButtonComp from "@/components/ButtonComp.vue";

export default defineComponent({
  name: "WordsViewTranslationConfirmationComp",
  components: {
    ButtonComp,
  },
  emits: ["confirm-translation", "open-editing-word-form"],
  methods: {
    confirmTranslation() {
      this.$emit("confirm-translation");
    },
    openEditingWordForm() {
      this.$emit("open-editing-word-form");
    },
  },
});
</script>

<template>
  <div class="translation-confirmation">
    <span
      class="translation-confirmation__title"
      v-text="$t('translation-not-confirmed')"
    />

    <div class="translation-confirmation__buttons">
      <ButtonComp
        :label="$t('confirm')"
        appearance="secondary"
        @click="confirmTranslation()"
      />
      <ButtonComp
        :label="$t('edit')"
        appearance="secondary"
        icon="edit"
        @click="openEditingWordForm()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.translation-confirmation {
  display: flex;
  flex-direction: column;

  &__title {
    @include text-subtitle-1;

    margin-block-end: 12px;
  }

  &__buttons {
    display: flex;
    column-gap: 16px;
  }
}
</style>
