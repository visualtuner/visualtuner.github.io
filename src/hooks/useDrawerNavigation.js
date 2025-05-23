import { useDrawer } from "../contexts/DrawerContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDrawerNavigation() {
    const { closeDrawer } = useDrawer(); // Get the global closeDrawer
    const navigate = useNavigate();
    const location = useLocation();

    const navigateWithClose = (path) => {
        const isSamePath = location.pathname === path;
        const isDrawerPushed = window.history.state?.drawerId; // Check if any drawer ID is in history state

        // If navigating to a different path AND a drawer was pushed to history,
        // we'll explicitly go back to clear that history entry *before* navigating.
        // This ensures the back button behavior is clean.
        if (!isSamePath && isDrawerPushed) {
            window.history.back(); // Pop the drawer history entry
            // The popstate listener in useDrawerHistory will then call onClose and closeDrawer
        }

        // Close the drawer immediately
        closeDrawer();

        // Navigate after a short delay to allow history pop to register if applicable
        // This might need fine-tuning, or consider a callback from useDrawerHistory if more precise timing is needed
        setTimeout(() => {
            navigate(path, { state: { noTransition: true } });
        }, 0); // Small delay to allow history.back to process first if it was called

    };

    return { navigateWithClose };
}