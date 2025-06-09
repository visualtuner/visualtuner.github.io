import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useOverlay } from "@/contexts/OverlayContext";

export default function useOverlayNavigation() {
	const { openOverlays, closeOverlay } = useOverlay();
	const navigate = useNavigate();
	const location = useLocation();
	const pendingNavigationRef = useRef(null);

	useEffect(() => {
		let hasOpenOverlay = false;
		for (const typeMap of openOverlays.values()) {
			for (const overlayData of typeMap.values()) {
				if (!overlayData.isClosing) {
					hasOpenOverlay = true;
					break;
				}
			}
			if (hasOpenOverlay) break;
		}

		if (!hasOpenOverlay && pendingNavigationRef.current) {
			const { path, options } = pendingNavigationRef.current;
			navigate(path, options);
			pendingNavigationRef.current = null;
		}
	}, [openOverlays, navigate]);

	// ✅ 수정된 함수 시그니처 (options 가능)
	const navigateWithClose = (path, options = {}) => {
		const isSamePath = location.pathname === path;

		const overlaysToClose = [];
		if (openOverlays.size > 0) {
			for (const [type, typeMap] of openOverlays.entries()) {
				for (const [id] of typeMap.entries()) {
					const overlayData = typeMap.get(id);
					if (!overlayData.isClosing) {
						overlaysToClose.push({ type, id, overlayData });
					}
				}
			}
		}

		overlaysToClose.forEach(({ type, id }) => {
			closeOverlay(type, id);
		});

		if (isSamePath) {
			if (
				window.history.state?.overlayType !== undefined &&
				window.history.state?.overlayId !== undefined
			) {
				window.history.back();
			}
			return;
		}

		console.log("[navigateWithClose] pending path:", path);
		console.log(
			"[navigateWithClose] incoming options.state:",
			options?.state
		);

		pendingNavigationRef.current = {
			path,
			options: {
				...options,
				state: {
					...(options.state || {}),
					noTransition: true,
				},
			},
		};
	};

	return { navigateWithClose };
}
