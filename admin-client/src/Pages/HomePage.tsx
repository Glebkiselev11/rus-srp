import { CircleButton } from "../components/CircleButton";
import { useNavigate } from "react-router-dom";
import { useGetAllQuery } from "../store/words";
import { WordItem } from "../components/WordItem";

export default function HomePage() {
	const navigate = useNavigate();

	const { data, isSuccess } = useGetAllQuery(0);

	const circleButtonHandler = () => {
		navigate("/new");
	};
	
	return (
		<main>
			<div className="mt-20 ml-40">
				{isSuccess && data.result.map(word => <WordItem key={word.id} word={word} />)}
			</div>

			<div className="fixed bottom-5 right-5">
				<CircleButton icon="+" onClick={() => circleButtonHandler()}/>
			</div>
		</main>
	);
}
