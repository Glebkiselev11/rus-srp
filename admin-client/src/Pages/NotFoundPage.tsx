import { Link } from "react-router-dom";

export default function NotFoundPage() {
	return (
		<main className="flex justify-center items-center h-screen">

			<div className="flex flex-col items-center bg-teal-50 p-5 px-14 shadow-sm">
				<h1 className="text-8xl">404</h1>
				<span className="text-2xl mb-3">Page not found</span> 
				<span className="hover:underline">
					<Link to="/">HOME</Link>
				</span>
			</div>

		</main>
	);
}
