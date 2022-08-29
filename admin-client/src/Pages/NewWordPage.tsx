import { useState } from "react";
import { INewWord } from "../models/index";
import { TextInput } from "../components/TextInput";
import { AppButton } from "../components/AppButton";
import { useTranslation } from "react-i18next";

export default function NewWordPage() {
	const { t } = useTranslation();

	const [newWord, setNewWord] = useState<INewWord>({
		srp_cyrillic: "", 
		srp_latin: "",
		rus: ""
	});

	const save = () => {
		console.log("saving");
	};

	return (
		<main className="flex w-full">
			<div className="mt-20 ml-40">

				<h1 className="text-4xl mb-12">{t("add-new-word")}</h1>

				<div className="flex flex-col w-[500px]">
					<TextInput 
						value={newWord.rus} 
						label="Russian"
						className="mb-5" 
						onChange={rus => setNewWord({ ...newWord, rus })}
					/>

					<TextInput 
						value={newWord.srp_cyrillic} 
						label="Serbian cyrilic"
						className="mb-5" 
						onChange={srp_cyrillic => setNewWord({ ...newWord, srp_cyrillic })}
					/>

					<TextInput 
						value={newWord.srp_latin} 
						label="Serbian latin"
						className="mb-8"
						onChange={srp_latin => setNewWord({ ...newWord, srp_latin })}
					/>

					<div>
						<AppButton label={t(("save"))} onClick={save}/>
					</div>

				</div>
			</div>
		</main>
	);
}
