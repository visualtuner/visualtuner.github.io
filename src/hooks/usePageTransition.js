import React, { useMemo, useRef, useEffect } from "react";

export default function usePageTransition(
	location,
	navigationType,
	rootMenus = ["/"],
	noTransition = false
) {
	const prevLocation = useRef(location); // location 전체 저장
	const refMap = useRef(new Map());

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

	const isRootMenu = (path) => rootMenus.includes(path);

	const from = prevLocation.current.pathname;
	const to = location.pathname;
	const isFromRoot = isRootMenu(from);
	const isToRoot = isRootMenu(to);
	const needTransition = !(isFromRoot && isToRoot);

	const prevTransitionClass = prevLocation.current.state?.transitionClassName;
	const currentTransitionClass = location.state?.transitionClassName;
	const customTransition = currentTransitionClass || prevTransitionClass;

	let transitionClassNames = "";
	if (noTransition) {
		transitionClassNames = "";
	} else if (customTransition) {
		transitionClassNames =
			navigationType === "POP"
				? `${customTransition}-back`
				: `${customTransition}-forward`;
	} else if (isToRoot && !isFromRoot) {
		transitionClassNames = "page-back";
	} else if (needTransition) {
		transitionClassNames =
			navigationType === "POP" ? "page-back" : "page-forward";
	} else {
		transitionClassNames = "";
	}

	const transitionTimeout = noTransition ? 0 : needTransition ? 400 : 0;
	const pageTypeClass = isToRoot ? "page--root" : "page--sub";

	return {
		nodeRef,
		transitionClassNames,
		transitionTimeout,
		pageTypeClass,
	};
}
