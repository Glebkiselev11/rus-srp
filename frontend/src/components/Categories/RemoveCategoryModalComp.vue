<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Category } from "@/types/categories";
import { computed, onMounted, ref } from "vue";
import { ModalComp } from "@/shared/ui/Modal";
import type { LanguageCode } from "@/types/translations";
import { WordsService } from "@/shared/api";
import { InputComp } from "@/shared/ui/Input";
import { ButtonComp } from "@/shared/ui/Button";
import { useRoute, useRouter } from "vue-router";
import { useDeleteCategory } from "@/queries/categories";
import { useToasterStore } from "@/stores/toaster";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const toastStore = useToasterStore();
const deleteCategory = useDeleteCategory();

const props = defineProps<{
  category: Category;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const wordsInCategory = ref(0);
const confirmationInput = ref("");

const title = computed(() =>
  t("category-removing.title", {
    categoryName: props.category[locale.value as LanguageCode],
  })
);

const subtitle = computed(() =>
  t("category-removing.subtitle", wordsInCategory.value)
);

const confirmed = computed(() => {
  const key = props.category[locale.value as LanguageCode].toLocaleLowerCase();
  const input = confirmationInput.value.toLocaleLowerCase();
  return key === input;
});

onMounted(async () => {
  const { count } = await WordsService.query({
    category_id: props.category.id,
    limit: 0,
  });
  wordsInCategory.value = count;
});

async function removeCategory() {
  deleteCategory.mutate(props.category.id);

  toastStore.addToast({
    type: "info",
    message: t("category-was-removed", {
      category: props.category[locale.value as LanguageCode],
    }),
  });

  // Remove category_id from router query
  router.push({
    query: { ...route.query, category_id: undefined },
  });

  close();
}

function close() {
  emit("close");
}
</script>

<template>
  <ModalComp
    :title="title"
    :subtitle="subtitle"
    header-padding-inline="12px"
    @close="close"
  >
    <template #content>
      <div class="remove-category-modal">
        <span
          v-if="wordsInCategory > 0"
          class="remove-category-modal__description"
          v-text="t('category-removing.description')"
        />

        <InputComp
          v-model="confirmationInput"
          focus-on-mount
          :label="t('category-removing.confirmation-label')"
        />

        <div class="remove-category-modal__buttons">
          <ButtonComp
            :label="t('cancel')"
            color="neutral"
            appearance="secondary"
            @click="close"
          />
          <ButtonComp
            :disabled="!confirmed"
            color="negative"
            :label="t('yes-remove')"
            @click="removeCategory"
          />
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.remove-category-modal {
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 480px;

  &__description {
    @include text-body-1;

    margin-block-end: 24px;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    margin-block-start: 20px;
    column-gap: 8px;
  }
}
</style>
