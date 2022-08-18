import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import HomePage from "./Pages/HomePage";
import NewWordPage from "./Pages/NewWordPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
	return (
		<>
			<Navigation/>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/new" element={<NewWordPage/>}/>
				<Route
					path="*"
					element={<NotFoundPage/>}
				/>
			</Routes>
		</>
	);
}

export default App;
