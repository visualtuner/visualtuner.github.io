import { useEffect, useCallback, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useOverlay } from "@/contexts/OverlayContext";

export default function useOverlayHistory(
	overlayType,
	overlayId,
	isOpen,
	onClose,
	Component,
	props = {}
) {
	const {
		openOverlay: setGlobalOverlayOpen,
		closeOverlay: triggerGlobalClose,
	} = useOverlay();
	const location = useLocation();

	const isOverlayOpenRef = useRef(isOpen);
	useEffect(() => {
		isOverlayOpenRef.current = isOpen;
	}, [isOpen]);

	// pushState 했는지 여부 기록용
	const hasPushedHistoryRef = useRef(false);

	// 🔹 props stringify는 useMemo로 캐시
	const stringifiedProps = useMemo(() => JSON.stringify(props), [props]);

	useEffect(() => {
		if (isOpen) {
			const state = window.history.state;
			const isSameOverlay =
				state?.overlayType === overlayType &&
				state?.overlayId === overlayId;

			if (!state || !isSameOverlay) {
				window.history.pushState(
					{
						overlayType,
						overlayId,
						fromOverlay: true,
						prevPath: location.pathname + location.search,
					},
					""
				);
				setGlobalOverlayOpen(overlayType, overlayId, Component, props);
				hasPushedHistoryRef.current = true;
			} else {
				setGlobalOverlayOpen(overlayType, overlayId, Component, props);
				hasPushedHistoryRef.current = true;
			}
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isOpen,
		overlayType,
		overlayId,
		location.pathname,
		location.search,
		setGlobalOverlayOpen,
		Component,
		stringifiedProps,
	]);

	const handlePopState = useCallback(
		(event) => {
			const state = event.state;
			const currentOpenOverlay = isOverlayOpenRef.current;

			if (
				currentOpenOverlay &&
				(state === null ||
					state.overlayType !== overlayType ||
					state.overlayId !== overlayId)
			) {
				triggerGlobalClose(overlayType, overlayId);
			}
		},
		[overlayType, overlayId, triggerGlobalClose]
	);

	useEffect(() => {
		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [handlePopState]);

	const requestCloseOverlay = useCallback(() => {
		triggerGlobalClose(overlayType, overlayId);

		if (
			hasPushedHistoryRef.current &&
			window.history.state?.overlayType === overlayType &&
			window.history.state?.overlayId === overlayId
		) {
			window.history.back();
			hasPushedHistoryRef.current = false;
		}
	}, [overlayType, overlayId, triggerGlobalClose]);

	return { requestCloseOverlay };
}
