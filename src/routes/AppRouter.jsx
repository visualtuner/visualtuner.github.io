import React, { useRef, useMemo, useEffect } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Home from "../pages/Home";
import Components from "../pages/Components";
import Buttons from "../pages/Buttons";

const ROOT_MENUS = ['/', '/Components'];

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

	const isRootMenu = (path) => ROOT_MENUS.includes(path);

	const from = prevLocation.current.pathname;
	const to = location.pathname;
	const isFromRoot = isRootMenu(from);
	const isToRoot = isRootMenu(to);

	// 새로 들어오는 애를 기준으로 트랜지션 판단
	const needTransition = !(isFromRoot && isToRoot);

	// ✨ 방향성 결정
	let transitionClassNames = "";
	if (isToRoot && !isFromRoot) {
		// 서브 → 메인 이동이면 무조건 page-back
		transitionClassNames = "page-back";
	} else {
		// 그 외는 navigationType 기준
		transitionClassNames = needTransition
			? navigationType === "POP"
				? "page-back"
				: "page-forward"
			: "";
	}

	// timeout도 transition 필요 여부에 따라
	const transitionTimeout = needTransition ? 200 : 0;

	// ✨ 메인/서브 분기 클래스
	const pageTypeClass = isRootMenu(location.pathname) ? "page--root" : "page--sub";

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