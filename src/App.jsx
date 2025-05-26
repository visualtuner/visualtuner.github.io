import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";
import { OverlayProvider } from "./contexts/OverlayContext";

export default function App() {
    return (
        <BrowserRouter basename="/SmartGuide">
            <OverlayProvider>
                <AppRouter />
                <NavBar />
                {/* SideDrawerWrapper나 ModalWrapper는 더 이상 필요 없습니다.
                    OverlayProvider 내부의 OverlayContainer가 모든 오버레이를 렌더링합니다. */}
            </OverlayProvider>
        </BrowserRouter>
    );
}