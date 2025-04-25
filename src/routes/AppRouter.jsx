import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Components from "../pages/Components";

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/Components" element={<Components />} />
		</Routes>
	);
}
