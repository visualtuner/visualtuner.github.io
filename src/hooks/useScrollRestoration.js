import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * @param {RefObject} containerRef - 스크롤 대상 DOM
 * @param {boolean} triggerRestore - 트랜지션 완료 여부
 * @param {Map} scrollPositions - AppRouter에서 전달받은 scroll map
 */
export default function useScrollRestoration(containerRef, triggerRestore = true, scrollPositions = new Map()) {
    const location = useLocation();
    const prevKeyRef = useRef(location.key);

    useEffect(() => {
        if (!triggerRestore) {
            console.log("[⏸ Skip Restore] transition not done yet.");
            return;
        }

        const key = location.key;
        const y = scrollPositions.get(key) ?? 0;

        const el = containerRef.current;
        setTimeout(() => {
            if (el) {
                el.scrollTo({ top: y, behavior: "auto" });
                console.log(`[✅ Restore Done] key: ${key}, scrollTop: ${y}`);
            } else {
                console.warn("[⚠️ Restore] containerRef is null");
            }
        }, 0);

        prevKeyRef.current = key;
    }, [triggerRestore, location.key, containerRef, scrollPositions]);
}
