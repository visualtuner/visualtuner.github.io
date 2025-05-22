import { useEffect, useCallback } from "react";

export default function useDrawerController({ isOpen, onClose, drawerKey }) {
	const handleClose = useCallback(() => {
		if (window.history.state?.[drawerKey] === true) {
			window.history.back();
			return;
		}
		onClose?.();
	}, [onClose, drawerKey]);

	useEffect(() => {
		if (isOpen) {
			if (window.history.state?.[drawerKey] !== true) {
				window.history.pushState({ [drawerKey]: true }, "");
			}
		}
	}, [isOpen, drawerKey]);

	useEffect(() => {
		const handlePop = () => {
			const state = window.history.state;
			if (isOpen && !state?.[drawerKey]) {
				handleClose();
			}
		};
		window.addEventListener("popstate", handlePop);
		return () => window.removeEventListener("popstate", handlePop);
	}, [isOpen, handleClose, drawerKey]);

	return { handleClose };
}
