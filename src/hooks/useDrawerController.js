import { useEffect, useCallback, useRef } from "react";

export default function useDrawerController({ isOpen, onClose, drawerKey = "drawer" }) {
	const pushedRef = useRef(false);

	const handleClose = useCallback(() => {
		const state = window.history.state || {};

		if (state?.[drawerKey]) {
			console.log(`[drawer][${drawerKey}] 🔙 history.back()`);
			window.history.back(); // drawer 상태만 pop
		} else {
			console.log(`[drawer][${drawerKey}] ❌ context close`);
			onClose?.();
		}
		pushedRef.current = false;
	}, [onClose, drawerKey]);

	// 드로어 열릴 때 drawerKey가 없으면 pushState
	useEffect(() => {
		if (isOpen && !pushedRef.current) {
			const state = window.history.state || {};
			if (!state?.[drawerKey]) {
				console.log(`[drawer][${drawerKey}] 🧱 push drawer entry`);
				window.history.pushState({ ...state, [drawerKey]: true }, "", window.location.href);
				pushedRef.current = true;
			}
		}
		if (!isOpen) {
			pushedRef.current = false;
		}
	}, [isOpen, drawerKey]);

	// popstate 발생 시 drawerKey가 없으면 닫기
	useEffect(() => {
		const handlePop = () => {
			const state = window.history.state || {};
			console.log(`[drawer][${drawerKey}] 🔙 popstate`, state);

			if (pushedRef.current && !state?.[drawerKey]) {
				console.log(`[drawer][${drawerKey}] ❌ close via pop`);
				onClose?.();
				pushedRef.current = false;
			}
		};

		window.addEventListener("popstate", handlePop);
		return () => window.removeEventListener("popstate", handlePop);
	}, [onClose, drawerKey]);

	return { handleClose };
}
