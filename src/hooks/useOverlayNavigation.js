import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useOverlay } from "../contexts/OverlayContext";

export default function useOverlayNavigation() {
    const { openOverlays, closeOverlay, removeOverlay } = useOverlay(); // removeOverlay도 필요할 수 있음
    const navigate = useNavigate();
    const location = useLocation();

    const pendingNavigationRef = useRef(null);

    useEffect(() => {
        let hasOpenOverlay = false;
        for (const typeMap of openOverlays.values()) {
            for (const overlayData of typeMap.values()) {
                if (!overlayData.isClosing) {
                    hasOpenOverlay = true;
                    break;
                }
            }
            if (hasOpenOverlay) break;
        }

        if (!hasOpenOverlay && pendingNavigationRef.current) {
            const { path, options } = pendingNavigationRef.current;
            navigate(path, options);
            pendingNavigationRef.current = null;
        }
    }, [openOverlays, navigate]);

    const navigateWithClose = (path) => {
        const isSamePath = location.pathname === path;

        // 모든 열린 오버레이를 닫기 대기 상태로 전환합니다.
        const overlaysToClose = [];
        if (openOverlays.size > 0) {
            for (const [type, typeMap] of openOverlays.entries()) {
                for (const [id] of typeMap.entries()) {
                    const overlayData = typeMap.get(id);
                    if (!overlayData.isClosing) {
                        overlaysToClose.push({ type, id });
                    }
                }
            }
        }

        // 오버레이 닫기 요청
        overlaysToClose.forEach(({ type, id }) => {
            closeOverlay(type, id);
        });

        // 현재 경로와 이동하려는 경로가 동일하면
        if (isSamePath) {
            // 이 경우가 핵심입니다.
            // 동일 페이지에서 오버레이를 열었을 때 쌓인 히스토리 엔트리를 제거합니다.
            // 단, 오버레이가 실제로 열려있는 상태에서만 이 작업을 수행해야 합니다.
            // (즉, window.history.state에 overlayType/overlayId 정보가 있는 경우)
            if (window.history.state?.overlayType && window.history.state.overlayType !== undefined) {
                 // 드로어를 열면서 쌓인 히스토리 엔트리를 제거합니다.
                window.history.back(); // 오버레이를 열면서 pushState했던 히스토리 엔트리를 제거
                // 이제 드로어를 열기 전의 페이지 상태가 됩니다.
            }
            return; // 라우팅 없이 함수 종료
        }

        // 라우팅 정보를 `pendingNavigationRef`에 저장하여 오버레이가 모두 닫힐 때까지 대기
        pendingNavigationRef.current = { path, options: { state: { noTransition: true } } };
    };

    return { navigateWithClose };
}