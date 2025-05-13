import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";
import SideDrawer from "./components/SideDrawer";

export default function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
	return (
		<BrowserRouter basename="/SmartGuide">
			<AppRouter />
			<NavBar />
            <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
		</BrowserRouter>
	);
}
