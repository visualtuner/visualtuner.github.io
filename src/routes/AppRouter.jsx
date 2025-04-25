import { Routes, Route, useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Home from "../pages/Home";
import Components from "../pages/Components";

export default function AppRouter() {
	const location = useLocation();

	return (
		<PageTransition>
			<Routes location={location}>
				<Route path="/" element={<Home />} />
				<Route path="/components" element={<Components />} />
			</Routes>
		</PageTransition>
	);
}
