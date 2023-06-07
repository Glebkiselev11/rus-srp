import { Routes, Route } from "react-router-dom";
import { AppNotification } from "./components/AppNotification";
import { SideMenu } from "./components/SideMenu";
import HomePage from "./Pages/HomePage";
import WordPage from "./Pages/WordPage";
import NotFoundPage from "./Pages/NotFoundPage";
import SettingsPage from "./Pages/SettingsPage";

function App() {

	return (
		<div className="flex">
			<SideMenu/>

			<div className="w-full h-[100vh] overflow-hidden bg-slate-100">
				<Routes >
					<Route path="/" element={<HomePage/>}/>
					<Route path="/settings" element={<SettingsPage/>}/>
					<Route path="/words/:wordId" element={<WordPage/>}/>
					<Route
						path="*"
						element={<NotFoundPage/>}
					/>
				</Routes>
			</div>

			<AppNotification/>
		</div>
	);
}

export default App;
