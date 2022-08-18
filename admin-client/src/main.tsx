import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {store} from "./store";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<Provider store={store}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</Provider>
	</BrowserRouter>
);
