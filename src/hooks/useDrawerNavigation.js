import { useDrawer } from "../contexts/DrawerContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDrawerNavigation() {
	const { setDrawerOpen } = useDrawer();
	const navigate = useNavigate();
	const location = useLocation();

	const navigateWithClose = (path) => {
		console.log("▶ navigateWithClose called", {
			current: location.pathname,
			target: path,
			state: location.state,
			historyLength: window.history.length,
		});

		const isSamePath = location.pathname === path;
		const isDrawerPushed = window.history.state?.drawer === true;

		// ✅ 같은 경로일 땐 pushState도 하지 말자!
		if (!isSamePath && !isDrawerPushed) {
			console.log("✅ pushState from navigateWithClose");
			window.history.pushState({ drawer: true }, "");
		}

		if (isSamePath) {
			console.log("🟨 same path → just close drawer, no navigate");
			setDrawerOpen(false);
			return;
		}

		console.log("🟩 navigating to new path with noTransition");
		setDrawerOpen(false);
		navigate(path, { state: { noTransition: true } });
	};

	return { navigateWithClose };
}