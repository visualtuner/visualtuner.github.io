// useScrollRestoration.js
import { useLayoutEffect, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map();

/**
 * @param {RefObject} containerRef - 스크롤 대상 DOM
 * @param {boolean} transitionDone - 트랜지션 완료 여부
 */
export default function useScrollRestoration(containerRef, transitionDone = true) {
  const location = useLocation();
  const prevKeyRef = useRef(location.key);

  // ✅ 트랜지션 완료 후에만 복원
  useLayoutEffect(() => {
    if (!transitionDone) {
      console.log("[⏸ Skip Restore] transition not done yet.");
      return;
    }

    const key = location.key;
    const scrollY = scrollPositions.get(key) ?? 0;

    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: scrollY, behavior: "auto" });
        console.log("[✅ Restore Done] key:", key, ", scrollTop:", scrollY);
      }
    });
  }, [transitionDone, location.key, containerRef]);

  // ✅ 페이지 이동 시 이전 페이지 스크롤 저장
  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (containerRef.current) {
      scrollPositions.set(prevKey, containerRef.current.scrollTop);
      console.log("[📦 Save onExit] key:", prevKey, ", scrollTop:", containerRef.current.scrollTop);
    }
    prevKeyRef.current = location.key;
  }, [location.key, containerRef]);
}
