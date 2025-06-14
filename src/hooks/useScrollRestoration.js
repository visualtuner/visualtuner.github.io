import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = { byKey: new Map(), byPath: {} };

export default function useScrollRestoration(containerRef, transitionDone = true) {
  const location = useLocation();
  const key = location.key;
  const path = location.pathname;

  // 스크롤 이벤트는 훅 내부에서 등록/해제
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      scrollPositions.byKey.set(key, el.scrollTop);
      scrollPositions.byPath[path] = el.scrollTop;
      console.log(`[📦 Save onScroll] key=${key}, path=${path}, scrollTop=${el.scrollTop}`);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [key, path, containerRef]);

  // transitionDone 이후 복원
  useLayoutEffect(() => {
    if (!transitionDone) return;
    const y = scrollPositions.byKey.get(key) ?? scrollPositions.byPath[path] ?? 0;
    console.log(`[🔍 Restore Attempt] key=${key}, path=${path}, scrollY=${y}`);
    containerRef.current?.scrollTo({ top: y, behavior: "auto" });
    console.log(`[✅ Restore Done] restored to ${containerRef.current?.scrollTop}`);
  }, [transitionDone, key, path, containerRef]);
}
