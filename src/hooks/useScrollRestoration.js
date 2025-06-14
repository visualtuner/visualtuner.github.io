// useScrollRestoration.js
import { useLayoutEffect, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = { byKey: new Map(), byPath: {} };

export default function useScrollRestoration(
	containerRef,
	transitionDone = true
) {
	const location = useLocation();
	const key = location.key;
	const path = location.pathname;
	const scrollListenerRef = useRef(null);

	// 스크롤 이벤트 저장 (by key + by path)
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const handler = () => {
			scrollPositions.byKey.set(key, el.scrollTop);
			scrollPositions.byPath[path] = el.scrollTop;
			console.log(`[📦 Save onScroll] key=${key}, path=${path}, scrollTop=${el.scrollTop}`);
		};
		el.addEventListener("scroll", handler);
		scrollListenerRef.current = handler;
		return () => el.removeEventListener("scroll", handler);
	}, [key, path, containerRef]);

	// transitionDone 완료되고 mount 후 복원
	useLayoutEffect(() => {
		if (!transitionDone) return;
		const y = scrollPositions.byKey.get(key) ?? scrollPositions.byPath[path] ?? 0;
		console.log(`[🔍 Restore Attempt] key=${key}, path=${path}, scrollY=${y}`);
		containerRef.current?.scrollTo({ top: y, behavior: "auto" });
		console.log(`[✅ Restore Done] restored to ${containerRef.current?.scrollTop}`);
	}, [transitionDone, key, path, containerRef]);
}
