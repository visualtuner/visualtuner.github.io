import { useDrawer } from "../contexts/DrawerContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDrawerNavigation() {
	const { setDrawerOpen } = useDrawer();
	const navigate = useNavigate();
	const location = useLocation();

	const navigateWithClose = (path) => {
		setDrawerOpen(false);
        if (location.pathname === path) return;
		navigate(path, { state: { noTransition: true } });
	};

	return { navigateWithClose };   
}