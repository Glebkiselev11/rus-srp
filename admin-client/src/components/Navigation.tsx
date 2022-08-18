import { Link } from "react-router-dom";

export function Navigation() {
	return (
		<nav className="flex justify-between items-center px-5 h-[50px] bg-gray-300">
			<span className="text-xl">Admin Panel</span>

			<span>
				<Link to="/" className="uppercase hover:underline">Home</Link>
			</span>
		</nav>
	);
}