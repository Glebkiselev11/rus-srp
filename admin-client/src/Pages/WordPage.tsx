import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AppButton } from "../components/AppButton";
import { TextInput } from "../components/TextInput";
import { useNotification } from "../hooks/notification";
import { ENotificationTypes, IWord } from "../models";
import { useGetQuery, useUpdateMutation } from "../store/words";
import { isWordValid } from "../utils/validators";

type WordPageParams = {
  wordId: string;
};

export default function NewWordPage() {
  const { t } = useTranslation();
  const { wordId } = useParams() as WordPageParams;
  const { data: word, isSuccess } = useGetQuery(wordId);
  const [mutatedWord, setMutatedWord] = useState(word);
  const { trigger } = useNotification();

  useEffect(() => {
    if (isSuccess) {
      setMutatedWord(word);
    }
  }, [isSuccess, word]);

  function handleChange(w: IWord) {
    setMutatedWord(w);
  }

  const [
    updateWord,
    { isSuccess: isSuccessUpdated, isLoading: isLoadingUpdatingWord },
  ] = useUpdateMutation();

  useEffect(() => {
    if (isSuccessUpdated) {
      trigger({ text: t("word-updated"), type: ENotificationTypes.success });
    }
  }, [isSuccessUpdated]);

  function handleUpdate() {
    if (mutatedWord) {
      updateWord(mutatedWord);
    }
  }

  return (
    <main className="flex w-full">
      <div className="mt-20 ml-40">
        {mutatedWord && (
          <div className="flex flex-col w-[500px]">
            <TextInput
              value={mutatedWord.rus}
              label={t("lang.russian")}
              className="mb-5"
              onChange={(rus) => handleChange({ ...mutatedWord, rus })}
            />

            <TextInput
              value={mutatedWord.srp_cyrillic}
              label={t("lang.serbian-cyrilic")}
              className="mb-5"
              onChange={(srp_cyrillic) =>
                handleChange({ ...mutatedWord, srp_cyrillic })
              }
            />

            <TextInput
              value={mutatedWord.srp_latin}
              label={t("lang.serbian-latin")}
              className="mb-8"
              onChange={(srp_latin) =>
                handleChange({ ...mutatedWord, srp_latin })
              }
            />

            <TextInput
              value={mutatedWord.eng}
              label={t("lang.english")}
              className="mb-8"
              onChange={(eng) => handleChange({ ...mutatedWord, eng })}
            />

            <div>
              <AppButton
                disabled={!isWordValid(mutatedWord)}
                loading={isLoadingUpdatingWord}
                label={t("save")}
                onClick={handleUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
