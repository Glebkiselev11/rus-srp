<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useTranslateHelpers, type LanguageCode } from "@/shared/Translate";
import { computed, ref } from "vue";
import type { Id, Order, RequestParams } from "@/shared/types";
import { CategoriesWidget } from "@/widgets/Categories";
import { TopBarComp } from "@/shared/ui/TopBar";
import { TableComp, TableRowComp, TableRowStatusComp } from "@/shared/ui/Table";
import { ImagePreviewComp } from "@/features/ImageExplorer";
import { ButtonComp } from "@/shared/ui/Button";
import { DropdownMenuComp, type MenuItem } from "@/shared/ui/DropdownMenu";
import { PaginationBarWidget } from "@/widgets/PaginationBar";
import { ZeroStateComp } from "@/shared/ui/ZeroState";
import { CategoryTitleWidget } from "@/widgets/CategoryTitle";
import TableRowSkeletonComp from "./TableRowSkeletonComp.vue";
import { CategoryWordsInsertModalWidget } from "@/widgets/CategoryWordsInsert";
import FilterPanelComp from "./FilterPanelComp.vue";
import { TranslationConfirmationComp } from "@/features/TranslationConfirmation";
import TranslationCellComp from "./TranslationCellComp.vue";
import {
  useDraftWordStore,
  useWordFormTabsStore,
  WordFormModalWidget,
} from "@/widgets/WordForm";
import {
  useDraftCategoryStore,
  CategoryFormModalWidget,
} from "@/widgets/CategoryForm";
import { useUpdateWord, useWordsQuery, type Word } from "@/entities/Word";
import { useToaster } from "@/shared/ui/Toaster";
import {
  useCategoryByIdQuery,
  CategoriesPreviewBadgesComp,
  type Category,
} from "@/entities/Category";
import { useDeleteWordsFromCategory } from "@/features/DeleteWordsFromCategory";
import { NavbarWidget } from "@/widgets/Navbar";
import { RemoveWordModalComp } from "@/features/RemoveWord";
import { useWordsPageFilter } from "../model/useWordsPageFilter";

const toaster = useToaster();
const { t, locale } = useI18n();

const {
  category_id,
  filter,
  search,
  order,
  translation_approved_status,
  limit,
  offset,
  DEFAULT_FILTER,
  LIMIT_DEFAULT,
} = useWordsPageFilter();
const { getLanguageCodesOrder, getLanguageLabel, translationPreview } =
  useTranslateHelpers();

const LIMIT_OPTIONS = [
  { value: LIMIT_DEFAULT, label: String(LIMIT_DEFAULT) },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const wordFormTabsStore = useWordFormTabsStore();
const draftWordStore = useDraftWordStore();
const draftCategoryStore = useDraftCategoryStore();

const hoverOnWordId = ref<Id | undefined>(undefined);
const showWordForm = ref(false);
const showCategoryForm = ref(false);
const showCategoryWordsInsertModal = ref(false);
const wordForRemove = ref<Word | undefined>(undefined);

const { data, status } = useWordsQuery(filter);
const { data: categoryData, status: categoryStatus } =
  useCategoryByIdQuery(category_id);
const deleteWordsFromCategory = useDeleteWordsFromCategory();
const updateWord = useUpdateWord();

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
      sort_key: "image" as const,
      icon: {
        name: "image",
        color: "tertiary",
      } as const,
      width: "64px",
    },
    ...translationColumns.value,
    {
      sortable: true,
      sort_key: "category_count" as const,
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

function openEditingCategory(category: Category) {
  draftCategoryStore.initDraftCategory(category);
  showCategoryForm.value = true;
}

function openCreationWordForm() {
  draftWordStore.initDraftWord(undefined);

  if (category_id.value) {
    draftWordStore.draftWord.category_ids.push(category_id.value);
  }

  showWordForm.value = true;
}

function openEditingWordFormOnCategoriesTab(word: Word) {
  openEditingWordForm(word);
  wordFormTabsStore.setCurrentTabToCategories();
}

function openWordsListModal() {
  showCategoryWordsInsertModal.value = true;
}

async function removeWordFromCategory(word: Word) {
  const category = categoryData.value?.category;

  if (!category) return;

  await deleteWordsFromCategory.mutateAsync({
    word_ids: [word.id],
    id: category.id,
  });

  toaster.addToast({
    type: "info",
    message: t("word-removed-from-category", {
      word: word[locale.value as LanguageCode],
      category: category[locale.value as LanguageCode],
    }),
  });
}

async function updateWordImage(word: Word, src: string) {
  await updateWord.mutateAsync({ ...word, image: src });

  toaster.addToast({
    type: "success",
    message: t("changes-saved"),
  });
}

function updateOrder(order?: Order) {
  filter.value = { ...filter.value, order };
}

function createdCategory(categoryId: Id) {
  category_id.value = categoryId;
  openWordsListModal();
}

function selectCategory(categoryId: Id) {
  filter.value = { ...DEFAULT_FILTER, search: "", category_id: categoryId };
}

function resetFiltersExcept(preserveFilter: keyof RequestParams) {
  filter.value = {
    ...DEFAULT_FILTER,
    [preserveFilter]: filter.value[preserveFilter],
  };
}
</script>

<template>
  <div class="words-page">
    <NavbarWidget />
    <CategoriesWidget
      :selected-category-id="filter.category_id"
      @update:selected-category-id="selectCategory"
      @created-category="createdCategory"
    />

    <div class="words-page__main">
      <TopBarComp>
        <template #left>
          <CategoryTitleWidget
            v-if="categoryStatus !== 'pending' || !category_id"
            :category="categoryData?.category"
            @edit="openEditingCategory"
          />
        </template>
        <template #right>
          <ButtonComp
            v-show="showAddToCategoryButton"
            :label="t('add-to-category')"
            appearance="inline"
            class="words-page__add-to-category-button"
            @click="openWordsListModal"
          />
          <ButtonComp
            icon="add"
            :label="t('create-word')"
            @click="openCreationWordForm"
          />
        </template>
      </TopBarComp>

      <div class="words-page__content">
        <FilterPanelComp
          v-model:search="search"
          v-model:order="order"
          v-model:translation-approved-status="translation_approved_status"
          :words-count-with-filter="data?.count"
          :category-id="category_id"
          @reset-filters-except-search="resetFiltersExcept('search')"
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
                <TranslationConfirmationComp
                  :word="word"
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
                :title="word[translation.sort_key]"
              >
                <TranslationCellComp
                  :word="word"
                  :translation="translation"
                  :search="search"
                  :hover="hoverOnWordId === word.id"
                />
              </td>

              <td>
                <CategoriesPreviewBadgesComp
                  :categories="word.categories"
                  :show-add-button="hoverOnWordId === word.id"
                  @click="openEditingWordFormOnCategoriesTab(word)"
                />
              </td>

              <td style="margin-inline-start: auto">
                <DropdownMenuComp
                  :items="
                    [
                      {
                        label: t('edit'),
                        icon: 'edit',
                        handler: () => openEditingWordForm(word),
                      },

                      'separator',

                      categoryData?.category
                        ? {
                            label: t('remove-word-from-category', {
                              category:
                                categoryData.category[locale as LanguageCode],
                            }),
                            icon: 'remove',
                            handler: () => removeWordFromCategory(word),
                          }
                        : false,

                      {
                        label: t('delete'),
                        icon: 'delete',
                        color: 'negative',
                        handler: () => (wordForRemove = word),
                      },
                    ].filter(Boolean) as MenuItem[]
                  "
                >
                  <template #trigger="{ isMenuOpen }">
                    <ButtonComp
                      icon="more_vert"
                      appearance="inline"
                      color="neutral"
                      size="compact"
                      :pressed="isMenuOpen"
                    />
                  </template>
                </DropdownMenuComp>
              </td>
            </TableRowComp>
          </template>

          <template v-else-if="status === 'pending'">
            <TableRowSkeletonComp
              :rows="limit"
              :grid-template-columns="gridTemplateColumns"
              :central-columns-count="translationColumns.length"
            />
          </template>

          <!-- Empty categry -->
          <template v-else-if="category_id && !search">
            <ZeroStateComp
              :title="t('empty-category')"
              :description="t('empty-category-description')"
            >
              <ButtonComp
                icon="add"
                appearance="inline"
                :label="t('add-to-category')"
                @click="openWordsListModal"
              />
            </ZeroStateComp>
          </template>

          <template v-else>
            <ZeroStateComp
              icon="search"
              :title="t('not-found')"
              :description="t('not-found-description')"
            />
          </template>

          <template v-if="showPagination && data" #pagination>
            <PaginationBarWidget
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

  <WordFormModalWidget v-if="showWordForm" @close="showWordForm = false" />

  <CategoryFormModalWidget
    v-if="showCategoryForm"
    @close="showCategoryForm = false"
  />

  <RemoveWordModalComp
    v-if="wordForRemove"
    :word="wordForRemove"
    @close="wordForRemove = undefined"
  />

  <CategoryWordsInsertModalWidget
    v-if="showCategoryWordsInsertModal && filter.category_id"
    :category-id="filter.category_id"
    @close="showCategoryWordsInsertModal = false"
  />
</template>

<style scoped lang="scss">
.words-page {
  display: grid;
  grid-template-columns: auto 280px 1fr;
  width: 100%;
  height: 100%;

  &__main {
    background: $color-background;
  }

  &__content {
    padding-inline: 16px;
  }

  &__add-to-category-button {
    margin-inline-end: 16px;
  }
}
</style>
