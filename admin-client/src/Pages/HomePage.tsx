import { CircleButton } from "../components/CircleButton";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
	const navigate = useNavigate();

	const circleButtonHandler = () => {
		navigate("/new");
	};
	
	return (
		<main>
			<h1 className="text-3xl font-bold">HomePage</h1>

			<div className="fixed bottom-5 right-5">
				<CircleButton icon="+" onClick={() => circleButtonHandler()}/>
			</div>
		</main>
	);
}
