import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NewWordPage from "./Pages/NewWordPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/new" element={<NewWordPage/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
