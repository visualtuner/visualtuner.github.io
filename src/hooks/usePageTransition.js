import React, { useMemo, useRef, useEffect } from "react";

export default function usePageTransition(location, navigationType, rootMenus = ["/"]) {
	const prevLocation = useRef(location);
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

	let transitionClassNames = "";
	if (isToRoot && !isFromRoot) {
		transitionClassNames = "page-back";
	} else {
		transitionClassNames = needTransition
			? navigationType === "POP"
				? "page-back"
				: "page-forward"
			: "";
	}

	const transitionTimeout = needTransition ? 300 : 0;
	const pageTypeClass = isToRoot ? "page--root" : "page--sub";

	return {
		nodeRef,
		transitionClassNames,
		transitionTimeout,
		pageTypeClass,
	};
}