import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { useRef, useMemo, useEffect, useState } from "react";

export default function PageTransition({ children }) {
	const location = useLocation();
	const refMap = useRef(new Map());
	const indexMap = useRef(new Map()); // key: pathname, value: index
	const [currentIndex, setCurrentIndex] = useState(0);
	const [prevIndex, setPrevIndex] = useState(0);

	const nodeRef = useMemo(() => {
		const path = location.pathname;
		if (!refMap.current.has(path)) {
			refMap.current.set(path, React.createRef());
		}
		return refMap.current.get(path);
	}, [location.pathname]);

	useEffect(() => {
		const path = location.pathname;
		if (!indexMap.current.has(path)) {
			const nextIndex = currentIndex + 1;
			indexMap.current.set(path, nextIndex);
			setPrevIndex(currentIndex);
			setCurrentIndex(nextIndex);
		} else {
			const knownIndex = indexMap.current.get(path);
			setPrevIndex(currentIndex);
			setCurrentIndex(knownIndex);
		}
	}, [location.pathname]);

	const direction = currentIndex < prevIndex ? "page-back" : "page-forward";

	return (
		<TransitionGroup
			component={null}
			childFactory={(child) =>
				React.cloneElement(child, {
					classNames: direction,
				})
			}
		>
			<CSSTransition
				key={location.pathname}
				timeout={4000}
				nodeRef={nodeRef}
				unmountOnExit
			>
				<div ref={nodeRef} className="page">
					{children}
				</div>
			</CSSTransition>
		</TransitionGroup>
	);
}
