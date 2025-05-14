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
	const { isDrawerOpen, setDrawerOpen } = useDrawer();

	return (
		<SideDrawer
			isOpen={isDrawerOpen}
			onClose={() => setDrawerOpen(false)}
		/>
	);
}
