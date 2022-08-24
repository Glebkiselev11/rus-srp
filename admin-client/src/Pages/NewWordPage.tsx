import { useInfoQuery } from "../store/NewWord/new-word.api";

export default function NewWordPage() {
	const { data, isError } = useInfoQuery();

	const errorView = () => <span className="text-red-500">Something went wrong</span>;

	return (
		<main className="flex w-full">
			<div className="mt-20 ml-40">

				<h1 className="text-4xl mb-5">Add new word</h1>

				{isError && errorView()}

				{data?.author}
			</div>
		</main>
	);
}
