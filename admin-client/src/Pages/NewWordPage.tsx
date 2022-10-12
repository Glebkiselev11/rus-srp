import { useEffect, useState } from "react";
import { ENotificationTypes, INewWord } from "../models/index";
import { TextInput } from "../components/TextInput";
import { AppButton } from "../components/AppButton";
import { useTranslation } from "react-i18next";
import { useCreateWordMutation } from "../store/words";
import { useNotification } from "../hooks/notification";
import { isWordValid } from "../utils/validators";

export default function NewWordPage() {
	const { t } = useTranslation();
	const { trigger } = useNotification();

	const initWord: INewWord = {
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

	return (
		<main className="flex w-full">
			<div className="mt-20 ml-40">

				<h1 className="text-4xl mb-12">{t("add-new-word")}</h1>

				<div className="flex flex-col w-[500px]">

					<TextInput 
						value={newWord.srp_cyrillic} 
						label={t("lang.serbian-cyrilic")}
						className="mb-5" 
						onChange={srp_cyrillic => setNewWord({ ...newWord, srp_cyrillic })}
					/>

					<TextInput 
						value={newWord.srp_latin} 
						label={t("lang.serbian-latin")}
						className="mb-5"
						onChange={srp_latin => setNewWord({ ...newWord, srp_latin })}
					/>

					<TextInput 
						value={newWord.rus} 
						label={t("lang.russian")}
						className="mb-5" 
						onChange={rus => setNewWord({ ...newWord, rus })}
					/>

					<TextInput 
						value={newWord.eng} 
						label={t("lang.english")}
						className="mb-8" 
						onChange={eng => setNewWord({ ...newWord, eng })}
					/>

					<div>
						<AppButton 
							disabled={!isWordValid(newWord)} 
							loading={isLoadingCreatingWord} 
							label={t(("save"))} 
							onClick={save}
						/>
					</div>

				</div>
			</div>
		</main>
	);
}
