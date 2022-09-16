import { CircleButton } from "../components/CircleButton";
import { useNavigate } from "react-router-dom";
import { useGetAllQuery } from "../store/words";
import { WordItem } from "../components/WordItem";
import { TextInput } from "../components/TextInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	const { data, isSuccess } = useGetAllQuery(0);

	const circleButtonHandler = () => {
		navigate("/new");
	};
	
	return (
		<main>
			<div className="mt-10 mx-40">
				<TextInput value={search} onChange={value => setSearch(value)} className="mb-5" label={t("search")} />

				{isSuccess && data.result.map(word => 
					<div key={word.id} className="mb-3">
						<WordItem word={word} />
					</div>
				)}
			</div>

			<div className="fixed bottom-5 right-5">
				<CircleButton icon="+" onClick={() => circleButtonHandler()}/>
			</div>
		</main>
	);
}
