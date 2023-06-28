import { IWord } from "../models";
import { useDeleteMutation } from "../store/words";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCropImagaeParamsToUrl } from "../utils/image";

interface WordItemProps {
  word: IWord;
}

export function WordItem({ word }: WordItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [deleteWord] = useDeleteMutation();

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    const shouldDelete = window.confirm(
      t("are-you-sure-delete", { word: word.rus })
    );
    if (shouldDelete) {
      await deleteWord(word.id);
    }
  }

  function handleClick() {
    navigate(`words/${word.id}`);
  }

  function getWordView() {
    return [word.srp_latin, word.rus, word.eng, word.srp_cyrillic]
      .filter((w) => w)
      .join(" - ");
  }

  return (
    <div
      onMouseEnter={() => setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
      onClick={handleClick}
      className="flex justify-between border border-gray-200 py-2 px-4 hover:cursor-pointer"
    >
      <div className="flex items-center">
        {word.image &&
          <img
            key={word.image}
            className="mr-4 h-10 w-10"
            src={addCropImagaeParamsToUrl(word.image, 200)}
          />
        }
        <div>{getWordView()}</div>
      </div>

      <button
        style={{ visibility: showRemoveButton ? "visible" : "hidden" }}
        className="border border-red-200 px-2 bg-red-200"
        onClick={handleDelete}
      >
        {t("delete")}
      </button>
    </div>
  );
}
