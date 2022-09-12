import { useState } from "react";
import { INewWord } from "../models/index";
import { TextInput } from "../components/TextInput";
import { AppButton } from "../components/AppButton";
import { useTranslation } from "react-i18next";
import { useCreateWordMutation } from "../store/words";

export default function NewWordPage() {
	const { t } = useTranslation();

	const [newWord, setNewWord] = useState<INewWord>({
		srp_cyrillic: "", 
		srp_latin: "",
		rus: ""
	});

	const isValid = () => !Object.values(newWord).some(w => w.length < 2);

	const [createWord, { isLoading: isLoadingCreatingWord }] = useCreateWordMutation();

	const save = () => {
		if (isValid()) {
			createWord(newWord);
		} 
	};

	return (
		<main className="flex w-full">
			<div className="mt-20 ml-40">

				<h1 className="text-4xl mb-12">{t("add-new-word")}</h1>

				<div className="flex flex-col w-[500px]">
					<TextInput 
						value={newWord.rus} 
						label={t("lang.russian")}
						className="mb-5" 
						onChange={rus => setNewWord({ ...newWord, rus })}
					/>

					<TextInput 
						value={newWord.srp_cyrillic} 
						label={t("lang.serbian-cyrilic")}
						className="mb-5" 
						onChange={srp_cyrillic => setNewWord({ ...newWord, srp_cyrillic })}
					/>

					<TextInput 
						value={newWord.srp_latin} 
						label={t("lang.serbian-latin")}
						className="mb-8"
						onChange={srp_latin => setNewWord({ ...newWord, srp_latin })}
					/>

					<div>
						<AppButton 
							disabled={!isValid()} 
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
