import { useGetAllQuery } from "../store/words";
import { WordItem } from "../components/WordItem";
import { useState } from "react";
import { FilterPanel } from "../components/FilterPanel";
import { useDebounce } from "../hooks/debounce";
import { AppHeader } from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { AppMain } from "../components/AppMain";
import { AppButton } from "../components/AppButton";
import { NewWordModal } from "../components/NewWordModal";
import { useCustomSearchParams } from "../utils/searchParams";

export default function HomePage() {
  const { t } = useTranslation();
  const [params, setParams] = useCustomSearchParams();

  const debouncedParams = useDebounce(params, 500);
  const { data, isSuccess } = useGetAllQuery(debouncedParams);

  const [showNewWordModal, setShowNewWordModal] = useState(false);
  const addWordButtonHandler = () => {
    setShowNewWordModal(!showNewWordModal);
  };

  const closeNewWordModalHandler = () => {
    setShowNewWordModal(false);
  };

  return (
    <>
      <AppHeader title={t("all-words")}>
        <AppButton
          label={t("add-word")}
          icon="add"
          type="filled"
          onClick={addWordButtonHandler}
        />
      </AppHeader>
      <AppMain>
        <div className="mt-10 mx-40">
          <div className="mb-5">
            <FilterPanel params={params} onChange={(p) => setParams(p)} />
          </div>

          {isSuccess &&
            data.result.map((word) => (
              <div key={word.id} className="mb-3">
                <WordItem word={word} />
              </div>
            ))}
        </div>
      </AppMain>

      <NewWordModal
        closeHander={closeNewWordModalHandler}
        show={showNewWordModal}
      />
    </>
  );
}
