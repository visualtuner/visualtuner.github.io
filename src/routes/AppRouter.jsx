import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Components from "../pages/Components";
import Layout from "../components/Layout";
import { variants, transition } from "../transition/transitionVariants";
import useNavigationDirection from "../hooks/useNavigationDirection";

export default function AppRouter() {
	const location = useLocation();
	const direction = useNavigationDirection();

	return (
		<Routes location={location}>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/Components" element={<Components />} />
			</Route>
		</Routes>
	);
}
