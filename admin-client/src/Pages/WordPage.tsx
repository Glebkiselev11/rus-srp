import { useParams } from "react-router-dom";
import { useGetQuery } from "../store/words";

export default function NewWordPage() {
	const { wordId = "" } = useParams();
	const { data, isSuccess } = useGetQuery(wordId);

	return (
		<div>{isSuccess && data.rus}</div>
	);
};
