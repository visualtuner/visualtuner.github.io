import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// 페이지별 스크롤 위치 저장소
const scrollPositions = new Map();

/**
 * @param {RefObject} containerRef - 스크롤 컨테이너 ref
 * @param {boolean} triggerRestore - 트랜지션 완료 여부
 */
export default function useScrollRestoration(containerRef, triggerRestore = true) {
    const location = useLocation();
    const prevKeyRef = useRef(location.key);

    // 페이지 이동 전: 이전 위치 저장
    useEffect(() => {
        const key = prevKeyRef.current;
        if (containerRef.current) {
            scrollPositions.set(key, containerRef.current.scrollTop);
        }
    }, [location.pathname, containerRef]);

    // 트랜지션 완료 후: 복원 실행
    useEffect(() => {
        if (!triggerRestore) return;

        const key = location.key;
        const y = scrollPositions.get(key) ?? 0;

        const el = containerRef.current;
        setTimeout(() => {
            if (el) el.scrollTo({ top: y, behavior: "auto" });
        }, 0); // 필요 시 50ms로 늘릴 수 있음

        prevKeyRef.current = key;
    }, [triggerRestore, location.key, containerRef]);
}
