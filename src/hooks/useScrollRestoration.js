import { useLayoutEffect, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const scrollPositions = { byKey: new Map(), byPath: {} };

export default function useScrollRestoration(
  containerRef,
  transitionDone = true,
  defaultRestore = true,
  overrideRestoreOnce
) {
  const { key, pathname: path, state } = useLocation();
  const navigate = useNavigate();

  const override = overrideRestoreOnce != null
    ? overrideRestoreOnce
    : typeof state?.restoreScroll === "boolean"
    ? state.restoreScroll
    : undefined;

  const shouldRestore = override !== undefined ? override : defaultRestore;

  const navigatedRef = useRef(false);
  const overrideRef = useRef(overrideRestoreOnce);

  console.log({ key, path, override, shouldRestore, mounted: navigatedRef.current });

  useEffect(() => {
    if (overrideRef.current != null && !navigatedRef.current) {
      navigatedRef.current = true;
      overrideRef.current = null; // 한 번만 실행
      navigate(path, { replace: true, state: {} });
    }
  }, [navigate, path]);

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

  useLayoutEffect(() => {
    if (!transitionDone || !shouldRestore) return;
    const y = scrollPositions.byKey.get(key) ?? scrollPositions.byPath[path] ?? 0;
    console.log(`🔍 스크롤 복원: top=${y}`);
    containerRef.current?.scrollTo({ top: y, behavior: "auto" });
  }, [transitionDone, shouldRestore, key, path, containerRef]);
}
