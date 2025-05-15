import React, { useMemo, useRef, useEffect } from "react";

export default function usePageTransition(location, navigationType, rootMenus = ["/"], noTransition = false) {
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

    console.log("[usePageTransition]", {
        from: prevLocation.current.pathname,
        to: location.pathname,
        navigationType,
        noTransition,
    });

	let transitionClassNames = "";
	if (noTransition) {
		transitionClassNames = "";
	} else if (isToRoot && !isFromRoot) {
		transitionClassNames = "page-back";
	} else if (needTransition) {
		if (navigationType === "POP") {
			transitionClassNames = "page-back";
		} else {
			transitionClassNames = "page-forward";
		}
	} else {
		transitionClassNames = "";
	}

	const transitionTimeout = noTransition ? 0 : needTransition ? 300 : 0;
	const pageTypeClass = isToRoot ? "page--root" : "page--sub";

	return {
		nodeRef,
		transitionClassNames,
		transitionTimeout,
		pageTypeClass,
	};
}