import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useOverlay } from "../contexts/OverlayContext";

// useOverlayHistory 훅: 오버레이의 히스토리 관리를 담당합니다.
// - overlayType, overlayId: 현재 오버레이의 타입과 고유 ID
// - isOpen: OverlayContainer에서 전달받는 현재 오버레이의 열림/닫힘 상태 (isClosing의 반대)
// - onClose: 오버레이 닫힘 애니메이션 완료 시 OverlayContext의 removeOverlay를 호출할 콜백
// - Component, props: 오버레이 컴포넌트 자체와 전달받은 props (openOverlay 호출 시 사용)
export default function useOverlayHistory(overlayType, overlayId, isOpen, onClose, Component, props = {}) {
    // useOverlay 훅에서 필요한 함수들을 가져옵니다.
    // setGlobalOverlayOpen: 오버레이를 컨텍스트에 등록 (히스토리 스택에 추가될 때)
    // triggerGlobalClose: 오버레이 닫힘 애니메이션을 트리거
    // removeGlobalOverlay: 오버레이를 컨텍스트에서 완전히 제거 (여기서는 onClose로 연결됨)
    const { openOverlay: setGlobalOverlayOpen, closeOverlay: triggerGlobalClose, removeOverlay: removeGlobalOverlay } = useOverlay();
    const location = useLocation(); // React Router의 현재 위치 정보

    // isOverlayOpenRef: 현재 오버레이 컴포넌트의 isOpen 상태를 useRef로 참조하여
    // 클로저 문제를 방지하고 최신 값을 유지합니다.
    const isOverlayOpenRef = useRef(isOpen);
    useEffect(() => {
        isOverlayOpenRef.current = isOpen;
    }, [isOpen]);

    // 오버레이 열림/닫힘에 따른 브라우저 히스토리 관리 useEffect
    // 오버레이가 열리거나 닫힐 때 브라우저 히스토리에 변화를 줍니다.
    useEffect(() => {
        if (isOpen) { // 오버레이가 "열린" 상태가 되면 (isClosing이 false)
            // 현재 브라우저 히스토리의 state에 이 오버레이 정보가 없거나 다른 오버레이인 경우에만
            // 새로운 히스토리 엔트리를 push합니다. (중복 방지)
            if (window.history.state?.overlayType !== overlayType || window.history.state?.overlayId !== overlayId) {
                // 브라우저 히스토리에 새 엔트리 추가: 오버레이 타입, ID, 오버레이로부터 왔다는 플래그, 이전 경로 저장
                window.history.pushState({ overlayType: overlayType, overlayId: overlayId, fromOverlay: true, prevPath: location.pathname + location.search }, "");
                // OverlayContext에 해당 오버레이의 컴포넌트 정보와 props를 함께 등록합니다.
                setGlobalOverlayOpen(overlayType, overlayId, Component, props);
            }
        }
        // 오버레이가 닫힐 때 (isOpen이 false가 될 때) 이 useEffect에서는 `history.back()`을 직접 호출하지 않습니다.
        // `history.back()` 호출은 `popstate` 이벤트 핸들러(`handlePopState`) 또는
        // `requestCloseOverlay` (수정됨)에서만 관리하여 로직을 분리합니다.
    }, [isOpen, overlayType, overlayId, location.pathname, location.search, setGlobalOverlayOpen, Component, JSON.stringify(props)]);
    // `props`는 객체이므로 `JSON.stringify`를 사용하여 의존성 변화를 감지합니다.

    // handlePopState 콜백: 브라우저의 뒤로가기/앞으로가기 버튼 동작(popstate 이벤트)을 처리합니다.
    const handlePopState = useCallback((event) => {
        const state = event.state; // popstate 이벤트에 포함된 히스토리 상태
        const currentOpenOverlay = isOverlayOpenRef.current; // 현재 훅이 연결된 오버레이의 최신 isOpen 상태

        // 1. 현재 이 오버레이가 '열린' 상태인데 (currentOpenOverlay &&),
        // 2. 히스토리 상태가 null (초기 상태)이거나 (state === null),
        // 3. 현재 히스토리 상태의 오버레이가 이 오버레이와 다른 경우 (state.overlayType !== overlayType || state.overlayId !== overlayId)
        // -> 이는 브라우저 뒤로가기 버튼을 눌러 이 오버레이를 닫아야 할 때입니다.
        if (currentOpenOverlay && (state === null || state.overlayType !== overlayType || state.overlayId !== overlayId)) {
            // 이 오버레이의 닫힘 애니메이션을 트리거합니다.
            // (OverlayContext의 `closeOverlay`를 호출하여 `isClosing` 상태를 true로 변경)
            triggerGlobalClose(overlayType, overlayId);
            // 실제 DOM 제거는 오버레이 컴포넌트의 닫힘 애니메이션 완료 후 `onClose`를 통해 이루어집니다.
        }
    }, [overlayType, overlayId, triggerGlobalClose]); // 의존성: 오버레이 타입, ID, 닫힘 트리거 함수

    // popstate 이벤트 리스너 등록 및 해제 useEffect
    useEffect(() => {
        window.addEventListener("popstate", handlePopState); // popstate 이벤트 리스너 등록
        return () => {
            window.removeEventListener("popstate", handlePopState); // 컴포넌트 언마운트 시 리스너 해제
        };
    }, [handlePopState]); // handlePopState 콜백이 변경될 때마다 리스너를 다시 등록합니다.

    // requestCloseOverlay 함수: 오버레이를 외부(버튼 클릭, 스와이프 등)에서 닫도록 요청합니다.
    const requestCloseOverlay = useCallback(() => {
        // 먼저 닫힘 애니메이션을 트리거합니다.
        triggerGlobalClose(overlayType, overlayId);

        // 이전과 달리, 여기서는 `window.history.back()`을 직접 호출하지 않습니다.
        // 이제 `history.back()` 호출은 오직 브라우저의 뒤로가기 버튼(popstate 이벤트)에 의해서만 발생하도록 합니다.
        // 이렇게 함으로써, 모달을 닫을 때 불필요한 라우팅 이동을 방지하고,
        // 오버레이가 닫힘 애니메이션을 재생한 후 `removeOverlay`를 통해 제거되도록 합니다.
    }, [overlayType, overlayId, triggerGlobalClose]); // 의존성: 오버레이 타입, ID, 닫힘 트리거 함수

    return { requestCloseOverlay }; // 외부에서 오버레이를 닫을 때 사용할 함수를 반환합니다.
}