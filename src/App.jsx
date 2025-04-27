import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";

export default function App() {
	return (
		<BrowserRouter basename="/SmartGuide">
			<AppRouter />
			<NavBar />
		</BrowserRouter>
	);
}
