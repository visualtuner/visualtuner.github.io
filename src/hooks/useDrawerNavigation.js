import { useDrawer } from "../contexts/DrawerContext";
import { useNavigate } from "react-router-dom";

export default function useDrawerNavigation() {
	const { setDrawerOpen } = useDrawer();
	const navigate = useNavigate();

	const navigateWithClose = (path) => {
		setDrawerOpen(false);
		navigate(path, { state: { noTransition: true } });
	};

	return { navigateWithClose };
}