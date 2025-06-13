// AppRouter.jsx
import React, { useState, useEffect } from "react";
import {
	Routes,
	Route,
	useLocation,
	useNavigationType,
	useNavigate,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "@/hooks/usePageTransition";
import Box from "@mui/material/Box";
import Home from "@/pages/Home";
import Components from "@/pages/Components";
import Buttons from "@/pages/Buttons";
import Profiles from "@/pages/Profiles";
import { TransitionProvider } from "@/contexts/TransitionContext";

const ROOT_MENUS = ["/", "/Components"];

export default function AppRouter() {
	const location = useLocation();
	const navigationType = useNavigationType();
	const navigate = useNavigate();

	const [transitionDone, setTransitionDone] = useState(false);

	useEffect(() => {
		if (location.state?.noTransition) {
			const newState = { ...location.state };
			delete newState.noTransition;
			console.log("🧼 Cleaning noTransition flag:", newState);
			navigate(location.pathname + location.search, {
				replace: true,
				state: newState,
			});
		}
	}, [location, navigate]);

	const { nodeRef, transitionClassNames, transitionTimeout, pageTypeClass } =
		usePageTransition(
			location,
			navigationType,
			ROOT_MENUS,
			!!location.state?.noTransition
		);

	return (
		// <TransitionProvider value={{ transitionDone, setTransitionDone }} >
			<TransitionGroup
				component={null}
				childFactory={(child) =>
					React.cloneElement(child, {
						classNames: transitionClassNames,
						timeout: transitionTimeout,
					})
				}
			>
				<CSSTransition
					key={location.pathname}
					nodeRef={nodeRef}
					timeout={transitionTimeout}
					unmountOnExit
					onExit={() => {
						console.log("[👋 onExit]", location.pathname);
						//setTransitionDone(false);
						console.log("=> transitionDone = false");
					}}
					onEntered={() => {
						console.log("[🎬 onEntered]", location.pathname);
						setTransitionDone(true);
						console.log("=> transitionDone = true");
					}}
				>
					<Box ref={nodeRef} className={`page ${pageTypeClass}`}>
						<Routes location={location}>
							<Route path="/" element={<Home />} />
							<Route
								path="/Components"
								element={<Components />}
							/>
							<Route
								path="/Components/Buttons"
								element={<Buttons />}
							/>
							<Route path="/Profiles" element={<Profiles />} />
						</Routes>
					</Box>
				</CSSTransition>
			</TransitionGroup>
		// </TransitionProvider>
	);
}
