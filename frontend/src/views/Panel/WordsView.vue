<script setup lang="ts">
import { useWordFormTabsStore } from "@/stores/wordFormTabs";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { highlighTextByQuery } from "@/common/utils";
import {
  getLanguageCodesOrder,
  getLanguageLabel,
  translationPreview,
} from "@/common/translations";
import { computed, ref } from "vue";
import type { Word } from "@/types/words";
import type { LanguageCode } from "@/types/translations";
import type {
  Id,
  Order,
  RequestParams,
  TranslationApprovedStatus,
} from "@/types/api";
import CategoriesComp from "@/components/Categories/CategoriesComp.vue";
import TopBarComp from "@/components/TopBarComp.vue";
import TableComp from "@/components/Table/TableComp.vue";
import TableRowComp from "@/components/Table/TableRowComp.vue";
import ImagePreviewComp from "@/components/ImagePreviewComp.vue";
import ButtonComp from "@/components/ButtonComp.vue";
import DropdownMenuComp from "@/components/DropdownMenuComp.vue";
import PaginationBarComp from "@/components/Pagination/PaginationBarComp.vue";
import ZeroStateComp from "@/components/ZeroStateComp.vue";
import WordsPageCategoryTitleComp from "@/components/WordsPageCategoryTitleComp.vue";
import CategoriesPreviewBadgesComp from "@/components/CategoriesPreviewBadgesComp.vue";
import WordsViewTableRowSkeletonComp from "@/components/WordsView/WordsViewTableRowSkeletonComp.vue";
import CategoryWordsInsertModalComp from "@/components/CategoryWordsInsert/CategoryWordsInsertModalComp.vue";
import WordFormModalComp from "@/components/WordForm/WordFormModalComp.vue";
import TableRowStatusComp from "@/components/Table/TableRowStatusComp.vue";
import WordsViewFilterPanelComp from "@/components/WordsView/WordsViewFilterPanelComp.vue";
import WordsViewTranslationConfirmationComp from "@/components/WordsView/WordsViewTranslationConfirmationComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { useUpdateWord, useDeleteWord, useWordsQuery } from "@/queries/words";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const LIMIT_DEFAULT = 25;

const DEFAULT_FILTER = {
  search: "",
  offset: 0,
  limit: LIMIT_DEFAULT,
  order: "-created_at" as Order,
  category_id: undefined,
  translation_approved_status: "all" as TranslationApprovedStatus,
};

const LIMIT_OPTIONS = [
  { value: LIMIT_DEFAULT, label: String(LIMIT_DEFAULT) },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const wordFormTabsStore = useWordFormTabsStore();
const draftWordStore = useDraftWordStore();

const hoverOnWordId = ref<Id | undefined>(undefined);
const showWordForm = ref(false);
const showCategoryWordsInsertModal = ref(false);

const filter = computed({
  get(): RequestParams {
    const {
      search,
      offset,
      limit,
      order,
      category_id,
      translation_approved_status,
    } = DEFAULT_FILTER;
    return {
      search: (route.query.search_word as string) || search,
      offset: Number(route.query.offset) || offset,
      limit: Number(route.query.limit) || limit,
      order: (route.query.order_word as Order) || order,
      category_id: Number(route.query.category_id) || category_id,
      translation_approved_status:
        (route.query
          .translation_approved_status as TranslationApprovedStatus) ||
        translation_approved_status,
    };
  },
  set(params: RequestParams) {
    router.push({
      query: {
        ...route.query,
        search_word: params.search,
        offset: params.offset,
        limit: params.limit,
        order_word: params.order,
        category_id: params.category_id,
        translation_approved_status: params.translation_approved_status,
      },
    });
  },
});

const { data, status, refetch } = useWordsQuery(filter);
const deleteWord = useDeleteWord();
const updateWord = useUpdateWord();

const search = computed({
  get(): string {
    return filter.value.search;
  },
  set(search: string) {
    const { offset } = DEFAULT_FILTER;
    filter.value = {
      ...filter.value,
      search,

      // reset pagination filters
      offset,
    };
  },
});

const limit = computed({
  get(): number {
    return filter.value.limit;
  },
  set(limit: number) {
    filter.value = { ...filter.value, limit, offset: 0 };
  },
});

const offset = computed({
  get(): number {
    return filter.value.offset;
  },
  set(offset: number) {
    filter.value = { ...filter.value, offset };
  },
});

const order = computed({
  get(): Order {
    return filter.value.order || "-created_at";
  },
  set(order: Order) {
    filter.value = { ...filter.value, order };
  },
});

const category_id = computed({
  get(): number | undefined {
    return filter.value.category_id;
  },
  set(category_id: number | undefined) {
    filter.value = { ...DEFAULT_FILTER, category_id };
  },
});

const translation_approved_status = computed({
  get(): TranslationApprovedStatus {
    return filter.value.translation_approved_status || "all";
  },
  set(translation_approved_status: TranslationApprovedStatus) {
    const { offset } = DEFAULT_FILTER;
    filter.value = {
      ...filter.value,
      translation_approved_status,
      offset,
    };
  },
});

const showAddToCategoryButton = computed(() => category_id.value !== undefined);
const showPagination = computed(() => data.value && data.value.count > 0);
const tableHeight = computed(() => {
  const HeaderAndPanelHeight = "160px";

  return `calc(100vh - ${HeaderAndPanelHeight})`;
});
const translationColumns = computed(() => {
  return getLanguageCodesOrder().map((code) => ({
    label: getLanguageLabel(code),
    sortable: true,
    sort_key: code,
    width: "164px",
  }));
});
const columns = computed(() => {
  return [
    {
      sortable: false,
      width: "12px",
    },
    {
      sortable: true,
      sort_key: "image",
      icon: {
        name: "image",
        color: "tertiary",
      } as const,
      width: "64px",
    },
    ...translationColumns.value,
    {
      sortable: true,
      sort_key: "category_count",
      width: "338px",
      label: t("categories"),
    },
    { sortable: false, width: "auto" },
  ];
});
const gridTemplateColumns = computed(() => {
  return columns.value.map((col) => col.width ?? "auto").join(" ");
});

function setHoveredWordId(id: Id, hovered: boolean) {
  hoverOnWordId.value = hovered ? id : undefined;
}

function openEditingWordForm(word: Word) {
  draftWordStore.initDraftWord(word);
  showWordForm.value = true;
}

function openCreationWordForm() {
  draftWordStore.initDraftWord(undefined);
  showWordForm.value = true;
}

function openEditingWordFormOnCategoriesTab(word: Word) {
  openEditingWordForm(word);
  wordFormTabsStore.setCurrentTabToCategories();
}

function openWordsListModal() {
  showCategoryWordsInsertModal.value = true;
}

function confirmTranslation(word: Word) {
  updateWord.mutateAsync({
    ...word,
    translation_approved: true,
  });
}

async function removeWord(word: Word) {
  const key = locale as LanguageCode;

  if (confirm(t("are-you-sure-delete", { word: word[key] }))) {
    await deleteWord.mutateAsync(word.id);
  }
}

function updateWordImage(word: Word, src: string) {
  updateWord.mutateAsync({ ...word, image: src });
}

function updateOrder(order: Order) {
  filter.value = { ...filter.value, order };
}
</script>

<template>
  <div class="words-view">
    <CategoriesComp
      :selected-category-id="filter.category_id"
      @update:selected-category-id="category_id = $event"
    />

    <div>
      <TopBarComp>
        <template #left>
          <WordsPageCategoryTitleComp :category-id="filter.category_id" />
        </template>
        <template #right>
          <ButtonComp
            v-show="showAddToCategoryButton"
            :label="$t('add-to-category')"
            appearance="inline"
            class="words-view__add-to-category-button"
            @click="openWordsListModal"
          />
          <ButtonComp
            icon="add"
            :label="$t('create-word')"
            @click="openCreationWordForm"
          />
        </template>
      </TopBarComp>

      <div class="words-view__content">
        <WordsViewFilterPanelComp
          v-model:search="search"
          v-model:order="order"
          v-model:translation-approved-status="translation_approved_status"
          :category-id="category_id"
        />

        <TableComp
          :columns="columns"
          :order="filter.order"
          :grid-template-columns="gridTemplateColumns"
          :table-height="tableHeight"
          @update:order="updateOrder"
        >
          <template v-if="data?.words.length && status === 'success'">
            <TableRowComp
              v-for="word in data.words"
              :id="word.id"
              :key="word.id"
              :grid-template-columns="gridTemplateColumns"
              highlight-on-hover
              @hover="setHoveredWordId(word.id, $event)"
            >
              <TableRowStatusComp
                :active="!word.translation_approved"
                :disabled="word.translation_approved"
              >
                <WordsViewTranslationConfirmationComp
                  @confirm-translation="confirmTranslation(word)"
                  @open-editing-word-form="openEditingWordForm(word)"
                />
              </TableRowStatusComp>

              <td>
                <ImagePreviewComp
                  :src="word.image"
                  :image-search-modal-subtitle="translationPreview(word)"
                  :default-image-search-query="word.eng"
                  @update:src="(src) => updateWordImage(word, src)"
                />
              </td>

              <td
                v-for="(translation, i) in translationColumns"
                :key="`${word.id}-${i}`"
                class="text-overflow-ellipsis"
                :title="word[translation.sort_key]"
                v-html="highlighTextByQuery(word[translation.sort_key], search)"
              />

              <td>
                <CategoriesPreviewBadgesComp
                  :categories="word.categories"
                  :show-add-button="hoverOnWordId === word.id"
                  @click="openEditingWordFormOnCategoriesTab(word)"
                />
              </td>

              <td style="margin-inline-start: auto">
                <DropdownMenuComp
                  v-slot="{ isMenuOpen }"
                  :items="[
                    {
                      label: $t('edit'),
                      icon: 'edit',
                      handler: () => openEditingWordForm(word),
                    },
                    'separator',
                    {
                      label: $t('delete'),
                      icon: 'delete',
                      color: 'negative',
                      handler: () => removeWord(word),
                    },
                  ]"
                >
                  <ButtonComp
                    icon="more_vert"
                    appearance="inline"
                    color="neutral"
                    size="compact"
                    :pressed="isMenuOpen"
                  />
                </DropdownMenuComp>
              </td>
            </TableRowComp>
          </template>

          <template v-else-if="status === 'pending'">
            <WordsViewTableRowSkeletonComp
              :rows="limit"
              :grid-template-columns="gridTemplateColumns"
              :central-columns-count="translationColumns.length"
            />
          </template>

          <template v-else>
            <ZeroStateComp
              icon="search"
              :title="$t('not-found')"
              :description="$t('not-found-description')"
            />
          </template>

          <template v-if="showPagination && data" #pagination>
            <PaginationBarComp
              :count="data.count"
              :offset="data.offset"
              :limit="limit"
              :limit-options="LIMIT_OPTIONS"
              @update:limit="limit = $event"
              @update:offset="offset = $event"
            />
          </template>
        </TableComp>
      </div>
    </div>
  </div>

  <WordFormModalComp v-if="showWordForm" @close="showWordForm = false" />

  <CategoryWordsInsertModalComp
    v-if="showCategoryWordsInsertModal && filter.category_id"
    :category-id="filter.category_id"
    @close="showCategoryWordsInsertModal = false"
    @refetch="refetch"
  />
</template>

<style scoped lang="scss">
@import "@/styles/main";

.words-view {
  display: grid;
  grid-template-columns: 280px 1fr;
  width: 100%;
  height: 100%;

  &__content {
    padding-inline: 16px;
  }

  &__add-to-category-button {
    margin-inline-end: 16px;
  }
}
</style>
