import { IWord } from "../models";
import { useDeleteMutation } from "../store/words";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WordItemProps {
  word: IWord
}

export function WordItem({ word }: WordItemProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [showRemoveButton, setShowRemoveButton] = useState(false);
	const [deleteWord] = useDeleteMutation();

	async function handleDelete()	{
		await deleteWord(word.id);
	}

	function handleClick() {
		navigate(`words/${word.id}`);	
	}

	return (
		<div 
			onMouseEnter={() => setShowRemoveButton(true)}
			onMouseLeave={() => setShowRemoveButton(false)}
			onClick={handleClick}
			className="flex justify-between border border-gray-200 py-2 px-4 hover:cursor-pointer"
		>

			<div>
				{word.rus} - {word.srp_cyrillic} - {word.srp_latin}
			</div>

			<button 
				style={{ visibility: showRemoveButton ? "visible" : "hidden" }} 
				className="border border-red-200 px-2 bg-red-200" 
				onClick={() => handleDelete()}
			>
				{t("delete")}
			</button>
		</div>
	);
}
