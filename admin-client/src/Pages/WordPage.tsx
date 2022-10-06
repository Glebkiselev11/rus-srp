import { useParams } from "react-router-dom";

export default function NewWordPage() {
	const { wordId } = useParams();

	return (
		<div>{wordId}</div>
	);
};
