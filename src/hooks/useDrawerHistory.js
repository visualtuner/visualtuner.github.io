import { useEffect, useCallback } from "react";
import { useDrawer } from "../contexts/DrawerContext"; // Assuming DrawerContext manages the openDrawerId

export default function useDrawerHistory(drawerId, isOpen, onClose) {
    const { openDrawerId, closeDrawer } = useDrawer();

    const handlePopState = useCallback((event) => {
        const state = event.state;
        // If the drawer was open and the history state no longer indicates it's open, close it.
        // This handles browser back button presses.
        if (isOpen && (state === null || state.drawerId !== drawerId)) {
            onClose(); // Call the drawer's specific onClose handler
            closeDrawer(); // Clear the global openDrawerId
        }
    }, [drawerId, isOpen, onClose, closeDrawer]);

    useEffect(() => {
        if (isOpen && openDrawerId === drawerId) {
            // Only push state if this drawer is actually opening and it's not already in history
            if (window.history.state?.drawerId !== drawerId) {
                window.history.pushState({ drawerId: drawerId }, "");
            }
        } else if (!isOpen && window.history.state?.drawerId === drawerId) {
            // If this drawer is closing and it's the one currently in history, pop it
            window.history.back();
        }
    }, [drawerId, isOpen, openDrawerId]);

    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [handlePopState]);

    // Function to close the drawer, ensuring history is handled correctly
    const requestCloseDrawer = useCallback(() => {
        if (window.history.state?.drawerId === drawerId) {
            window.history.back();
        } else {
            onClose(); // Direct close if not managed by history (e.g., initially opened without pushState)
            closeDrawer();
        }
    }, [drawerId, onClose, closeDrawer]);

    return { requestCloseDrawer };
}