<script lang="ts" setup>
import type { Id } from "@/types/api";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useModalWordsStore } from "@/stores/modalWords";
import { highlighTextByQuery } from "@/common/utils";
import { useTranslateHelpers } from "@/shared/Translate";
import WordsSearchInputComp from "@/components/WordsSearchInputComp.vue";
import { ButtonComp } from "@/shared/ui/Button";
import WordFormModalComp from "../WordForm/WordFormModalComp.vue";
import TableComp from "@/components/Table/TableComp.vue";
import TableRowComp from "@/components/Table/TableRowComp.vue";
import { CounterComp } from "@/shared/ui/Counter";
import { SwitchComp } from "@/shared/ui/Switch";
import { ZeroStateComp } from "@/shared/ui/ZeroState";
import { CheckboxComp } from "@/shared/ui/Checkbox";
import { TooltipComp } from "@/shared/ui/Tooltip";
import SkeletonItemComp from "../SkeletonItemComp.vue";
import { ImagePreviewComp } from "@/features/ImageExplorer";
import { useWordsInfinityQuery } from "@/entities/Word";

const { getLanguageCodesOrder } = useTranslateHelpers();
const { t } = useI18n();
const props = defineProps<{
  categoryId: Id;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "words-inserted"): void;
}>();

const modalWordsStore = useModalWordsStore();

const limit = 50;
const search = ref("");
const gridTemplateColumns = "48px 64px 1fr 1fr 1fr 1fr";
const showOnlySelected = ref(false);
const translationOrder = getLanguageCodesOrder();
const showWordForm = ref(false);

const requestParams = computed(() => ({
  search: search.value,
  limit,
}));

const { data, isFetching, fetchNextPage, isSuccess } =
  useWordsInfinityQuery(requestParams);

const words = computed(
  () => data.value?.pages.flatMap((page) => page.words) ?? []
);

const alreadyAddedWordIds = computed(() =>
  words.value
    .filter(({ categories }) =>
      categories.some(({ id }) => id === props.categoryId)
    )
    .map(({ id }) => id)
);

const filteredWords = computed(() => {
  if (showOnlySelected.value) {
    return words.value.filter(({ id }) =>
      modalWordsStore.selectedWordIds.includes(id)
    );
  } else {
    return words.value;
  }
});

const nothingWereFound = computed(
  () => filteredWords.value.length === 0 && isSuccess.value
);

function close() {
  emit("close");
}

async function clickAddButton() {
  await modalWordsStore.addSelectedWordsToCategory(props.categoryId);
  emit("words-inserted");
}

function isWordDisabled(wordId: Id): boolean {
  return alreadyAddedWordIds.value.includes(wordId);
}

function isWordChecked(wordId: Id): boolean {
  return (
    modalWordsStore.selectedWordIds.includes(wordId) ||
    alreadyAddedWordIds.value.includes(wordId)
  );
}

function getTooltipText(wordId: Id): string {
  if (isWordDisabled(wordId)) {
    return t("included-in-the-category");
  }

  if (isWordChecked(wordId)) {
    return t("dont-add-to-category");
  }

  return t("add-to-category");
}

function handleWordCreated(id: Id) {
  modalWordsStore.updateSelectedWordIds(id, true);
}
</script>

<template>
  <div class="category-words-insert">
    <div class="category-words-insert__panel">
      <WordsSearchInputComp
        :search="search"
        :search-placeholder="t('find-word')"
        :category-id="props.categoryId"
        appearance="default"
        width="100%"
        @update:search="search = $event"
      />

      <ButtonComp
        icon="add"
        appearance="inline"
        :label="t('create-word')"
        class="create-word-button"
        @click="showWordForm = true"
      />
    </div>

    <TableComp
      :grid-template-columns="gridTemplateColumns"
      :infinite-scroll-config="{ distance: 100 }"
      table-height="calc(100vh - 300px)"
      class="category-words-insert__table"
      @scroll-to-bottom="fetchNextPage"
    >
      <template v-if="nothingWereFound">
        <ZeroStateComp
          icon="search"
          :title="t('not-found', { search })"
          :description="t('not-found-description')"
        />
      </template>

      <template v-else>
        <TableRowComp
          v-for="word in filteredWords"
          :key="word.id"
          :grid-template-columns="gridTemplateColumns"
          highlight-on-hover
        >
          <td>
            <TooltipComp
              :text="getTooltipText(word.id)"
              position="bottom-right"
            >
              <CheckboxComp
                :model-value="isWordChecked(word.id)"
                :disabled="isWordDisabled(word.id)"
                @update:model-value="
                  (x) => modalWordsStore.updateSelectedWordIds(word.id, x)
                "
              />
            </TooltipComp>
          </td>

          <td>
            <ImagePreviewComp :src="word.image" static />
          </td>

          <td
            v-for="(langCode, i) in translationOrder"
            :key="`${word.id}-${i}`"
            v-html="highlighTextByQuery(word[langCode], search)"
          />
        </TableRowComp>

        <template v-if="isFetching">
          <TableRowComp
            v-for="row in limit"
            :key="row"
            :grid-template-columns="gridTemplateColumns"
          >
            <td>
              <SkeletonItemComp
                height="20px"
                width="20px"
                border-radius="2px"
              />
            </td>

            <td>
              <SkeletonItemComp
                height="40px"
                width="40px"
                border-radius="8px"
              />
            </td>

            <td v-for="col in translationOrder.length" :key="`${row}-${col}`">
              <SkeletonItemComp
                height="20px"
                random-width
                border-radius="4px"
              />
            </td>
          </TableRowComp>
        </template>
      </template>
    </TableComp>

    <div class="category-words-insert__footer">
      <div v-show="modalWordsStore.isAnyWordSelected">
        <span v-text="t('show-only-selected')" />
        <SwitchComp v-model="showOnlySelected" />
      </div>

      <!-- This extra div needed for make sure that save buttos always right -->
      <div />

      <div>
        <ButtonComp
          :label="t('cancel')"
          appearance="secondary"
          @click="close"
        />

        <ButtonComp
          :label="t('add')"
          :disabled="!modalWordsStore.isAnyWordSelected"
          @click="clickAddButton"
        >
          <template v-if="modalWordsStore.isAnyWordSelected" #right>
            <CounterComp :count="modalWordsStore.selectedWordIds.length" />
          </template>
        </ButtonComp>
      </div>
    </div>
  </div>

  <WordFormModalComp
    v-if="showWordForm"
    @close="showWordForm = false"
    @created="handleWordCreated"
  />
</template>

<style lang="scss" scoped>
.category-words-insert {
  width: 742px;

  &__panel {
    display: flex;
    align-items: center;
    column-gap: 12px;
    margin-block-end: 16px;
    margin-inline: 16px;

    .create-word-button {
      flex-shrink: 0;
    }
  }

  &__table {
    margin-inline: 16px;
    border-radius: 8px 8px 0 0;
    border-block-end: none;
  }

  &__footer {
    border-block-start: 1px solid $color-separator-primary;
    display: flex;
    justify-content: space-between;
    padding-block: 20px;
    padding-inline: 16px;
    align-items: center;

    & > div {
      display: flex;
      column-gap: 8px;
    }
  }
}
</style>
