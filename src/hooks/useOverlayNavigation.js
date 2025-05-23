import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useOverlay } from "../contexts/OverlayContext";

export default function useOverlayNavigation() {
    const { openOverlays, closeOverlay } = useOverlay();
    const navigate = useNavigate();
    const location = useLocation();

    const pendingNavigationRef = useRef(null);

    useEffect(() => {
        const hasOpenOverlay = Object.keys(openOverlays).some(type =>
            Object.keys(openOverlays[type]).length > 0
        );

        if (!hasOpenOverlay && pendingNavigationRef.current) {
            const { path, options } = pendingNavigationRef.current;
            navigate(path, options);
            pendingNavigationRef.current = null;
        }
    }, [openOverlays, navigate]);

    const navigateWithClose = (path) => {
        const isSamePath = location.pathname === path;

        const currentlyOpenOverlayTypes = Object.keys(openOverlays);
        if (currentlyOpenOverlayTypes.length > 0) {
            currentlyOpenOverlayTypes.forEach(type => {
                Object.keys(openOverlays[type]).forEach(id => {
                    closeOverlay(type, id);
                });
            });
        }

        if (isSamePath) {
            return;
        }

        pendingNavigationRef.current = { path, options: { state: { noTransition: true } } };
    };

    return { navigateWithClose };
}