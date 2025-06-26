import { useLayoutEffect, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ 스크롤 위치 저장소 (key + containerId 기준 + fallback용 path)
const scrollPositions = {
  byKeyAndId: new Map(),
  byPath: {},
};

/**
 * 스크롤 위치 저장 및 복원 훅
 * 
 * @param {RefObject} containerRef - 스크롤 대상 요소 ref
 * @param {string} [containerId="default"] - 컨테이너 고유 ID
 * @param {boolean} [transitionDone=true] - 트랜지션 완료 여부
 * @param {boolean} [defaultRestore=true] - 기본적으로 복원할지 여부
 * @param {boolean} [overrideRestoreOnce] - location.state에서 1회성 override
 */
export default function useScrollRestoration(
  containerRef,
  containerId = "default",
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

  const mapKey = `${key}_${containerId}`;
  const pathKey = `${pathname}_${containerId}`;

  // ✅ restoreScroll: false → 위치 0으로 초기화
  useEffect(() => {
    if (hasHandledRef.current || override == null) return;
    hasHandledRef.current = true;

    if (override === false) {
      scrollPositions.byKeyAndId.set(mapKey, 0);
      scrollPositions.byPath[pathKey] = 0;
    }

    navigate(pathname + search, {
      replace: true,
      state: {},
    });
  }, [override, mapKey, pathKey, pathname, search, navigate]);

  // ✅ 스크롤 위치 저장
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = () => {
      const y = el.scrollTop;
      scrollPositions.byKeyAndId.set(mapKey, y);
      scrollPositions.byPath[pathKey] = y;
    };

    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [mapKey, pathKey, containerRef]);

  // ✅ 스크롤 위치 복원 (byKey → byPath → 0)
  useLayoutEffect(() => {
    if (!transitionDone || !shouldRestore) return;

    const y =
      scrollPositions.byKeyAndId.get(mapKey) ??
      scrollPositions.byPath[pathKey] ??
      0;

    containerRef.current?.scrollTo({ top: y, behavior: "auto" });
  }, [transitionDone, shouldRestore, mapKey, pathKey, containerRef]);
}
