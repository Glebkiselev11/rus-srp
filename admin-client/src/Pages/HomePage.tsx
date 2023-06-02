import { useNavigate } from "react-router-dom";
import { useGetAllQuery } from "../store/words";
import { WordItem } from "../components/WordItem";
import { useState } from "react";
import { FilterPanel } from "../components/FilterPanel";
import { IRequestParams } from "../models/api";
import { useDebounce } from "../hooks/debounce";
import { AppHeader } from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { AppMain } from "../components/AppMain";
import { AppButton } from "../components/AppButton";

export default function HomePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [params, setParams] = useState<IRequestParams>({});

	const debouncedParams = useDebounce(params, 500);
	const { data, isSuccess } = useGetAllQuery(debouncedParams);

	const circleButtonHandler = () => {
		navigate("/new");
	};
	
	return (
		<>
			<AppHeader title={t("all-words")}>
				<AppButton label={t("add-new-word")} type="filled" onClick={() => circleButtonHandler()}/>

			</AppHeader>
			<AppMain>
				<div className="mt-10 mx-40">
					<div className="mb-5">
						<FilterPanel params={params} onChange={p => setParams(p)} />
					</div>

					{isSuccess && data.result.map(word => 
						<div key={word.id} className="mb-3">
							<WordItem word={word} />
						</div>
					)}
				</div>

			</AppMain>
		</>
	);
}
