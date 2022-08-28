import { useState } from "react";
import { INewWord } from "../models/index";
import { TextInput } from "../components/TextInput";

export default function NewWordPage() {

	const [newWord, setNewWord] = useState<INewWord>({
		srp_cyrillic: "", 
		srp_latin: "",
		rus: ""
	});

	return (
		<main className="flex w-full">
			<div className="mt-20 ml-40">

				<h1 className="text-4xl mb-12">Add new word</h1>

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
						onChange={srp_latin => setNewWord({ ...newWord, srp_latin })}
					/>

				</div>
			</div>
		</main>
	);
}
