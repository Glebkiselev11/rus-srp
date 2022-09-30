import { CircleButton } from "../components/CircleButton";
import { useNavigate } from "react-router-dom";
import { useGetAllQuery } from "../store/words";
import { WordItem } from "../components/WordItem";
import { useState } from "react";
import { FilterPanel } from "../components/FilterPanel";
import { IRequestParams } from "../models/api";

export default function HomePage() {
	const navigate = useNavigate();
	const [params, setParams] = useState<IRequestParams>({});

	const { data, isSuccess } = useGetAllQuery(params);

	const circleButtonHandler = () => {
		navigate("/new");
	};
	
	return (
		<main>
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

			<div className="fixed bottom-5 right-5">
				<CircleButton icon="+" onClick={() => circleButtonHandler()}/>
			</div>
		</main>
	);
}
