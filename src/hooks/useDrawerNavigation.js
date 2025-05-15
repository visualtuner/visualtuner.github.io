import { useDrawer } from "../contexts/DrawerContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDrawerNavigation() {
	const { setDrawerOpen } = useDrawer();
	const navigate = useNavigate();
	const location = useLocation();

	const navigateWithClose = (path) => {
		if (location.pathname === path) {
			// 같은 경로일 경우 드로어만 닫기
			setDrawerOpen(false);
			return;
		}

		// 다른 경로일 때만 이동 + 드로어 닫기
		setDrawerOpen(false);
		navigate(path, { state: { noTransition: true } });
	};

	return { navigateWithClose };
}