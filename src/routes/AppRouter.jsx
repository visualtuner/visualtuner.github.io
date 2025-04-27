import React, { useRef, useMemo } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Home from "../pages/Home";
import Components from "../pages/Components";

export default function AppRouter() {
	const location = useLocation();
	const navigationType = useNavigationType();
	const transitionClassNames = navigationType === "POP" ? "page-back" : "page-forward";

	const refMap = useRef(new Map());

	const nodeRef = useMemo(() => {
		const path = location.pathname;
		if (!refMap.current.has(path)) {
			refMap.current.set(path, React.createRef());
		}
		return refMap.current.get(path);
	}, [location.pathname]);

	console.log(transitionClassNames);

	return (
		<TransitionGroup
			component={null}
			childFactory={(child) =>
				React.cloneElement(child, {
					classNames: transitionClassNames, // ✅ 여기에 강제로 매 이동마다 direction 주입
				})
			}
		>
			<CSSTransition
				key={location.pathname}
				nodeRef={nodeRef}
				timeout={300}
				unmountOnExit
			>
				<div ref={nodeRef} className="page">
					<Routes location={location}>
						<Route path="/" element={<Home />} />
						<Route path="/Components" element={<Components />} />
					</Routes>
				</div>
			</CSSTransition>
		</TransitionGroup>
	);
}