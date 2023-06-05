import { useEffect, useState } from "react";
import { ENotificationTypes, IDraftWord } from "../models";
import { AppModal } from "./AppModal";
import { TextInput } from "./TextInput";
import { useCreateWordMutation } from "../store/words";
import { useTranslation } from "react-i18next";
import { AppButton } from "./AppButton";
import { isWordValid } from "../utils/validators";
import { useNotification } from "../hooks/notification";

interface NewWordModalProps {
  show: boolean;
  closeHander: () => void
}

export function NewWordModal({ show, closeHander }: NewWordModalProps) {
	const { t } = useTranslation();
	const { trigger } = useNotification();

	const initWord: IDraftWord = {
		srp_cyrillic: "", 
		srp_latin: "",
		rus: "",
		eng: "",
	};
	const [newWord, setNewWord] = useState(initWord);
	const [createWord, { isLoading: isLoadingCreatingWord, isSuccess: isSuccessCreatedWord }] = useCreateWordMutation();

	const save = () => {
		if (isWordValid(newWord)) {
			createWord(newWord);
		} 
	};

	useEffect(() => {
		if (isSuccessCreatedWord) {
			trigger({ text: t("word-added"), type: ENotificationTypes.success });
			setNewWord(initWord);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isSuccessCreatedWord ]);

	if (!show) return null;

	return (
		<AppModal title={t("adding-word.title")} description={t("adding-word.description")} closeHandler={closeHander}>
			<div className="pt-8 h-[548px] flex flex-col justify-between">
				<div>
					<TextInput 
						value={newWord.eng} 
						label="English"
						className="mb-5" 
						onChange={eng => setNewWord({ ...newWord, eng })}
					/>

					<TextInput 
						value={newWord.rus} 
						label="Русский"
						className="mb-5" 
						onChange={rus => setNewWord({ ...newWord, rus })}
					/>

					<TextInput 
						value={newWord.srp_cyrillic} 
						label="Српски"
						className="mb-5" 
						onChange={srp_cyrillic => setNewWord({ ...newWord, srp_cyrillic })}
					/>

					<TextInput 
						value={newWord.srp_latin} 
						label="Srpski"
						className="mb-5"
						onChange={srp_latin => setNewWord({ ...newWord, srp_latin })}
					/>
				</div>

				<div className="flex justify-end">
					<AppButton 
						type="filled"
						disabled={!isWordValid(newWord)} 
						loading={isLoadingCreatingWord} 
						label={t(("save"))} 
						onClick={save}
					/>
				</div>

			</div> 
		</AppModal>
	);
}