import { useLayoutEffect, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ 복원 실패 방지를 위해 key + path 모두 저장
const scrollPositions = {
	byKey: new Map(),
	byPath: {},
};

export default function useScrollRestoration(
	containerRef,
	transitionDone = true,
	defaultRestore = true,
	overrideRestoreOnce
) {
	const location = useLocation();
	const navigate = useNavigate();
	const { key, pathname, search, state } = location;

	const hasHandledRef = useRef(false);

	const override =
		overrideRestoreOnce != null
			? overrideRestoreOnce
			: typeof state?.restoreScroll === "boolean"
			? state.restoreScroll
			: undefined;

	const shouldRestore = override !== undefined ? override : defaultRestore;

	// ⚠️ restoreScroll: false 처리
	useEffect(() => {
		if (hasHandledRef.current || override == null) return;

		hasHandledRef.current = true;

		if (override === false) {
			scrollPositions.byKey.set(key, 0);
			scrollPositions.byPath[pathname] = 0;
			// console.log("💥 위치 0으로 초기화됨");
		}

		navigate(pathname + search, {
			replace: true,
			state: {},
		});
	}, [override, key, pathname, search, navigate]);

	// ✅ 스크롤 위치 저장
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const handler = () => {
			scrollPositions.byKey.set(key, el.scrollTop);
			scrollPositions.byPath[pathname] = el.scrollTop;
		};

		el.addEventListener("scroll", handler);
		return () => el.removeEventListener("scroll", handler);
	}, [key, pathname, containerRef]);

	// ✅ 복원 (fallback: key → path → 0)
	useLayoutEffect(() => {
		if (!transitionDone || !shouldRestore) return;

		const y =
			scrollPositions.byKey.get(key) ??
			scrollPositions.byPath[pathname] ??
			0;

		// console.log(`🔍 복원됨: scrollTop=${y}`);
		containerRef.current?.scrollTo({ top: y, behavior: "auto" });
	}, [transitionDone, shouldRestore, key, pathname, containerRef]);
}
