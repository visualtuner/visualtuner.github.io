import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import NavBar from "@/components/NavBar";
import { OverlayProvider } from "@/contexts/OverlayContext";

export default function App() {
    return (
        <BrowserRouter basename="/SmartGuide">
            <OverlayProvider>
                <AppRouter />
                <NavBar />
            </OverlayProvider>
        </BrowserRouter>
    );
}