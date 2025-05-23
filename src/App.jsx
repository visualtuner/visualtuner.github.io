import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";
import SideDrawer from "./components/SideDrawer";
import { DrawerProvider, useDrawer } from "./contexts/DrawerContext";

export default function App() {
	return (
		<BrowserRouter basename="/SmartGuide">
			<DrawerProvider>
				<AppRouter />
				<NavBar />
                <DrawerWrapper />
			</DrawerProvider>
		</BrowserRouter>
	);
}

function DrawerWrapper() {
    const { openDrawerId, closeDrawer } = useDrawer();

    return (
        <SideDrawer
            isOpen={openDrawerId === "mainSideDrawer"} // openDrawerId가 "mainSideDrawer"일 때만 isOpen이 true가 됩니다.
            onClose={closeDrawer}
        />
    );
}