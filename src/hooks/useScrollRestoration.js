import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @param {RefObject} containerRef - 스크롤 대상 요소 (예: .layout)
 * @param {boolean} triggerRestore - 트랜지션 완료 여부
 * @param {Map} scrollPositions - pathname 기준 scroll 저장소
 */
export default function useScrollRestoration(containerRef, triggerRestore = true, scrollPositions = new Map()) {
    const location = useLocation();

    useEffect(() => {
        if (!triggerRestore) {
            console.log("[⏸ Skip Restore] transition not done yet.");
            return;
        }

        const path = location.pathname;
        const y = scrollPositions.get(path) ?? 0;

        const el = containerRef.current;
        setTimeout(() => {
            if (el) {
                el.scrollTo({ top: y, behavior: "auto" });
                console.log(`[✅ Restore Done] path: ${path}, scrollTop: ${y}`);
            }
        }, 0);
    }, [triggerRestore, location.pathname, containerRef, scrollPositions]);
}
