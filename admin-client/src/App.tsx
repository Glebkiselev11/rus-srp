import { Routes, Route } from "react-router-dom";
import { AppNotification } from "./components/AppNotification";
import { Navigation } from "./components/Navigation";
import HomePage from "./Pages/HomePage";
import NewWordPage from "./Pages/NewWordPage";
import WordPage from "./Pages/WordPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {

	return (
		<>
			<Navigation/>

			<div className="mt-[100px]">
				<Routes >
					<Route path="/" element={<HomePage/>}/>
					<Route path="/new" element={<NewWordPage/>}/>
					<Route path="/words/:wordId" element={<WordPage/>}/>
					<Route
						path="*"
						element={<NotFoundPage/>}
					/>
				</Routes>
			</div>

			<AppNotification/>

		</>
	);
}

export default App;
