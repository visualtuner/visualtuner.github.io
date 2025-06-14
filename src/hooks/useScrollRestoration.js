// useScrollRestoration.js
import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = { byKey: new Map(), byPath: {} };

export default function useScrollRestoration(
	containerRef,
	transitionDone = true,
	defaultRestore = true,
	overrideRestore
) {
	const location = useLocation();
	const key = location.key;
	const path = location.pathname;

	// 실제 복원 여부 계산
	const shouldRestore =
		overrideRestore !== undefined ? overrideRestore : defaultRestore;

	// 스크롤 이벤트 저장
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const handler = () => {
			scrollPositions.byKey.set(key, el.scrollTop);
			scrollPositions.byPath[path] = el.scrollTop;
		};
		el.addEventListener("scroll", handler);
		return () => el.removeEventListener("scroll", handler);
	}, [key, path, containerRef]);

	// transitionDone 이후 복원 or 스킵
	useLayoutEffect(() => {
		if (!transitionDone) return;
		if (!shouldRestore) return;

		const y =
			scrollPositions.byKey.get(key) ?? scrollPositions.byPath[path] ?? 0;
		containerRef.current?.scrollTo({ top: y, behavior: "auto" });
	}, [transitionDone, key, path, containerRef, shouldRestore]);
}
