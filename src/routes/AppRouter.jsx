import React from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "../hooks/usePageTransition";
import Home from "../pages/Home";
import Components from "../pages/Components";
import Buttons from "../pages/Buttons";

const ROOT_MENUS = ['/', '/Components'];

export default function AppRouter() {
	const location = useLocation();
	const navigationType = useNavigationType();

	const {
		nodeRef,
		transitionClassNames,
		transitionTimeout,
		pageTypeClass,
	} = usePageTransition(location, navigationType, ROOT_MENUS);

	return (
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
			>
				<div ref={nodeRef} className={`page ${pageTypeClass}`}>
					<Routes location={location}>
						<Route path="/" element={<Home />} />
						<Route path="/Components" element={<Components />} />
						<Route path="/Components/Buttons" element={<Buttons />} />
					</Routes>
				</div>
			</CSSTransition>
		</TransitionGroup>
	);
}