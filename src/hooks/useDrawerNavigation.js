import { useDrawer } from "../contexts/DrawerContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDrawerNavigation() {
	const { setDrawerOpen } = useDrawer();
	const navigate = useNavigate();
	const location = useLocation();

	const navigateWithClose = (path) => {
		const isSamePath = location.pathname === path;
		const isDrawerPushed = window.history.state?.drawer === true;

		// 같은 경로일 땐 pushState도 하지 말자!
		if (!isSamePath && !isDrawerPushed) {
			window.history.pushState({ drawer: true }, "");
		}

		if (isSamePath) {
			setDrawerOpen(false);
			return;
		}

		setDrawerOpen(false);
		navigate(path, { state: { noTransition: true } });
	};

	return { navigateWithClose };
}