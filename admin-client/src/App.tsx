import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NewWordPage from "./Pages/NewWordPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/new" element={<NewWordPage/>}/>
				<Route
					path="*"
					element={<NotFoundPage/>}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
