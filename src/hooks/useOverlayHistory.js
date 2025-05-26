import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useOverlay } from "../contexts/OverlayContext";

export default function useOverlayHistory(overlayType, overlayId, isOpen, onClose, Component, props = {}) {
    const { openOverlay: setGlobalOverlayOpen, closeOverlay: triggerGlobalClose } = useOverlay();
    const location = useLocation();

    const isOverlayOpenRef = useRef(isOpen);
    useEffect(() => {
        isOverlayOpenRef.current = isOpen;
    }, [isOpen]);

    // 이 오버레이가 히스토리에 pushState를 했는지 여부를 추적하는 Ref
    const hasPushedHistoryRef = useRef(false);

    useEffect(() => {
        if (isOpen) {
            // 현재 브라우저 히스토리의 state에 이 오버레이 정보가 없거나 다른 오버레이인 경우에만
            // 새로운 히스토리 엔트리를 push합니다. (중복 방지)
            if (!window.history.state || window.history.state?.overlayType !== overlayType || window.history.state?.overlayId !== overlayId) {
                window.history.pushState({ overlayType: overlayType, overlayId: overlayId, fromOverlay: true, prevPath: location.pathname + location.search }, "");
                setGlobalOverlayOpen(overlayType, overlayId, Component, props);
                hasPushedHistoryRef.current = true; // 히스토리에 푸시했음을 기록
            } else {
                // 이미 해당 오버레이가 최상단 히스토리 엔트리라면, pushState는 하지 않지만
                // 오버레이는 열려있으므로 컨텍스트에 등록은 계속 합니다.
                setGlobalOverlayOpen(overlayType, overlayId, Component, props);
                hasPushedHistoryRef.current = true; // 이미 히스토리에 푸시되어 있다고 간주
            }
        }
        // 오버레이가 닫힐 때는 이 useEffect에서 직접 history.back()을 호출하지 않습니다.
    }, [isOpen, overlayType, overlayId, location.pathname, location.search, setGlobalOverlayOpen, Component, JSON.stringify(props)]);

    const handlePopState = useCallback((event) => {
        const state = event.state;
        const currentOpenOverlay = isOverlayOpenRef.current;

        // 현재 오버레이가 열려있는데, 뒤로가기 상태가 null이거나 현재 오버레이가 아닌 경우
        if (currentOpenOverlay && (state === null || state.overlayType !== overlayType || state.overlayId !== overlayId)) {
            // 이 오버레이의 닫힘 애니메이션을 트리거
            triggerGlobalClose(overlayType, overlayId);
            // 여기서 window.history.back()을 호출하지 않습니다. popstate 자체가 히스토리 이동을 수행합니다.
        }
    }, [overlayType, overlayId, triggerGlobalClose]);

    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [handlePopState]);

    const requestCloseOverlay = useCallback(() => {
        // 먼저 닫힘 애니메이션을 트리거
        triggerGlobalClose(overlayType, overlayId);

        // 이 오버레이가 히스토리 스택에 엔트리를 추가했고,
        // 현재 브라우저 히스토리의 최상단 상태가 이 오버레이에 대한 정보라면
        // (즉, 뒤로가기 버튼을 누르면 이 오버레이가 닫히는 상황이라면)
        // 해당 히스토리 엔트리를 제거합니다.
        if (hasPushedHistoryRef.current && window.history.state?.overlayType === overlayType && window.history.state?.overlayId === overlayId) {
            window.history.back();
            hasPushedHistoryRef.current = false; // 히스토리에서 제거했음을 기록
        }
    }, [overlayType, overlayId, triggerGlobalClose]);

    return { requestCloseOverlay };
}