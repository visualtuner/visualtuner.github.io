import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";
import SideDrawer from "./components/SideDrawer";
import { OverlayProvider, useOverlay } from "./contexts/OverlayContext";
import MyModalComponent from "./components/MyModalComponent"; // 모달 컴포넌트 임포트

export default function App() {
    return (
        <BrowserRouter basename="/SmartGuide">
            <OverlayProvider>
                <AppRouter />
                <NavBar />
                <SideDrawerWrapper />
                <ModalWrapper />
            </OverlayProvider>
        </BrowserRouter>
    );
}

function SideDrawerWrapper() {
    const { isOverlayOpen, closeOverlay } = useOverlay();

    return (
        <SideDrawer
            isOpen={isOverlayOpen("drawer", "mainSideDrawer")}
            onClose={() => closeOverlay("drawer", "mainSideDrawer")}
        />
    );
}

function ModalWrapper() {
    const { isOverlayOpen, closeOverlay } = useOverlay();

    return (
        <MyModalComponent
            isOpen={isOverlayOpen("modal", "myLoginModal")}
            onClose={() => closeOverlay("modal", "myLoginModal")}
        />
    );
}