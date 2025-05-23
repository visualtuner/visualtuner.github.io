import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useOverlay } from "../contexts/OverlayContext";

export default function useOverlayHistory(overlayType, overlayId, isOpen, onClose) {
    const { openOverlay: setGlobalOverlayOpen, closeOverlay: setGlobalOverlayClose } = useOverlay();
    const location = useLocation();

    const isOverlayOpenRef = useRef(isOpen);
    useEffect(() => {
        isOverlayOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (window.history.state?.overlayType !== overlayType || window.history.state?.overlayId !== overlayId) {
                window.history.pushState({ overlayType: overlayType, overlayId: overlayId, fromOverlay: true, prevPath: location.pathname + location.search }, "");
                setGlobalOverlayOpen(overlayType, overlayId);
            }
        } else {
            if (window.history.state?.overlayType === overlayType && window.history.state?.overlayId === overlayId) {
                window.history.back();
            }
        }
    }, [isOpen, overlayType, overlayId, location.pathname, location.search, setGlobalOverlayOpen]);

    const handlePopState = useCallback((event) => {
        const state = event.state;
        const currentOpenOverlay = isOverlayOpenRef.current;

        if (currentOpenOverlay && (state === null || state.overlayType !== overlayType || state.overlayId !== overlayId)) {
            onClose();
            setGlobalOverlayClose(overlayType, overlayId);
        }
    }, [overlayType, overlayId, onClose, setGlobalOverlayClose]);

    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [handlePopState]);

    const requestCloseOverlay = useCallback(() => {
        if (window.history.state?.overlayType === overlayType && window.history.state?.overlayId === overlayId) {
            window.history.back();
        } else {
            onClose();
            setGlobalOverlayClose(overlayType, overlayId);
        }
    }, [overlayType, overlayId, onClose, setGlobalOverlayClose]);

    return { requestCloseOverlay };
}