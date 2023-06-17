import { useEffect, useState } from "react";
import { ENotificationTypes, IDraftWord } from "../models";
import { AppModal } from "./AppModal";
import { TextInput } from "./TextInput";
import { useCreateWordMutation } from "../store/words";
import { useTranslation } from "react-i18next";
import { AppButton } from "./AppButton";
import { isWordValid } from "../utils/validators";
import { useNotification } from "../hooks/notification";
import { useTranslateMutation } from "../store/translate";
import {
  getTranslationTargets,
  fillDrafWordWithTranslation,
} from "../utils/translations";

interface NewWordModalProps {
  show: boolean;
  closeHander: () => void;
}

export function NewWordModal({ show, closeHander }: NewWordModalProps) {
  const { t } = useTranslation();
  const { trigger } = useNotification();

  const initWord: IDraftWord = {
    srp_latin: "",
    rus: "",
    eng: "",
  };
  const [draftWord, setDraftWord] = useState(initWord);
  const [
    createWord,
    { isLoading: isLoadingCreatingWord, isSuccess: isSuccessCreatedWord },
  ] = useCreateWordMutation();
  const [
    translate,
    {
      isLoading: isLoadingTranslation,
      isSuccess: isSuccessTranslated,
      data: translationData,
    },
  ] = useTranslateMutation();
  const [isAnyInputFilled, setIsAnyInputFilled] = useState(false);

  const save = () => {
    if (isWordValid(draftWord)) {
      createWord(draftWord);
    }
  };

  const fillEmptyInputs = () => {
    const { targets, from, text } = getTranslationTargets(draftWord);
    if (from && text) {
      translate({ targets, from, text });
    }
  };

  useEffect(() => {
    if (isSuccessTranslated && translationData) {
      setDraftWord(fillDrafWordWithTranslation(translationData, draftWord));
    }
  }, [translationData, isSuccessTranslated, isLoadingTranslation]);

  useEffect(() => {
    if (isSuccessCreatedWord) {
      trigger({ text: t("word-added"), type: ENotificationTypes.success });
      setDraftWord(initWord);
    }
  }, [isSuccessCreatedWord]);

  useEffect(() => {
    const values = Object.values(draftWord);
    const anyFilled = values.some((x) => x.length);
    const anyEmpty = values.some((x) => x.length === 0);
    setIsAnyInputFilled(anyFilled && anyEmpty);
  }, [draftWord]);

  if (!show) return null;

  return (
    <AppModal
      title={t("adding-word.title")}
      description={t("adding-word.description")}
      closeHandler={closeHander}
    >
      <div className="pt-8 h-[548px] flex flex-col justify-between">
        <div>
          <TextInput
            value={draftWord.eng}
            label="English"
            className="mb-5"
            clearable
            onChange={(eng) => setDraftWord({ ...draftWord, eng })}
          />

          <TextInput
            value={draftWord.rus}
            label="Русский"
            className="mb-5"
            clearable
            onChange={(rus) => setDraftWord({ ...draftWord, rus })}
          />

          <TextInput
            value={draftWord.srp_latin}
            label="Srpski"
            className="mb-5"
            clearable
            onChange={(srp_latin) => setDraftWord({ ...draftWord, srp_latin })}
          />

          {isAnyInputFilled && (
            <AppButton
              disabled={isLoadingTranslation}
              icon="edit_note"
              label={t("fill-in-auto")}
              onClick={fillEmptyInputs}
            />
          )}
        </div>

        <div className="flex justify-end">
          <AppButton
            className="mr-2"
            label={t("cancel")}
            onClick={closeHander}
          />
          <AppButton
            type="filled"
            disabled={!isWordValid(draftWord)}
            loading={isLoadingCreatingWord}
            label={t("save")}
            onClick={save}
          />
        </div>
      </div>
    </AppModal>
  );
}
