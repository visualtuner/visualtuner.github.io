import React, { useRef, useMemo, useEffect } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Home from "../pages/Home";
import Components from "../pages/Components";
import Buttons from "../pages/Buttons"; // 추가

const MAIN_MENUS = ['/', '/Components'];

export default function AppRouter() {
	const location = useLocation();
	const navigationType = useNavigationType();

	const refMap = useRef(new Map());
	const prevLocation = useRef(location);

	useEffect(() => {
		prevLocation.current = location;
	}, [location]);

	const nodeRef = useMemo(() => {
		const path = location.pathname;
		if (!refMap.current.has(path)) {
			refMap.current.set(path, React.createRef());
		}
		return refMap.current.get(path);
	}, [location.pathname]);

	const isMainMenu = (path) => MAIN_MENUS.includes(path);

	const from = prevLocation.current.pathname;
	const to = location.pathname;
	const isFromMain = isMainMenu(from);
	const isToMain = isMainMenu(to);

	// 새로 들어오는 애를 기준으로 트랜지션 판단
	const needTransition = !(isFromMain && isToMain);

	const transitionClassNames = needTransition
		? navigationType === "POP"
			? "page-back"
			: "page-forward"
		: "";

	const transitionTimeout = needTransition ? 300 : 0;

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
				<div ref={nodeRef} className="page">
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