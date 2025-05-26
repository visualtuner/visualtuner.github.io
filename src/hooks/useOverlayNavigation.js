import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useOverlay } from "../contexts/OverlayContext";

export default function useOverlayNavigation() {
    const { openOverlays, closeOverlay } = useOverlay(); // OverlayContext에서 상태와 함수 가져오기
    const navigate = useNavigate(); // React Router의 navigate 함수
    const location = useLocation(); // React Router의 현재 위치 정보

    // pendingNavigationRef: 오버레이가 닫힌 후 수행할 라우팅 정보를 임시로 저장합니다.
    const pendingNavigationRef = useRef(null);

    // openOverlays 상태 변화를 감지하여 라우팅을 수행하는 useEffect
    useEffect(() => {
        let hasOpenOverlay = false;
        // openOverlays Map을 순회하며 '열린' (isClosing이 false인) 오버레이가 있는지 확인합니다.
        for (const typeMap of openOverlays.values()) {
            for (const overlayData of typeMap.values()) {
                // isClosing이 false인 경우에만 오버레이를 "열린 상태"로 간주합니다.
                // 닫힘 애니메이션 중인 오버레이는 더 이상 라우팅을 막지 않습니다.
                if (!overlayData.isClosing) {
                    hasOpenOverlay = true;
                    break; // 열린 오버레이를 하나라도 찾으면 루프 종료
                }
            }
            if (hasOpenOverlay) break; // 열린 오버레이를 찾았으므로 외부 루프도 종료
        }

        // 열린 오버레이가 없고, 대기 중인 라우팅이 있다면 (즉, `MapsWithClose`가 호출되었다면)
        if (!hasOpenOverlay && pendingNavigationRef.current) {
            const { path, options } = pendingNavigationRef.current;
            navigate(path, options); // 실제 라우팅 수행
            pendingNavigationRef.current = null; // 대기 중인 라우팅 정보 초기화
        }
    }, [openOverlays, navigate]); // openOverlays 상태와 navigate 함수가 변경될 때마다 실행

    // navigateWithClose 함수: 오버레이를 닫은 후 특정 경로로 이동합니다.
    const navigateWithClose = (path) => {
        const isSamePath = location.pathname === path; // 현재 경로와 동일한지 확인

        // 모든 열린 오버레이를 닫기 대기 상태로 전환합니다.
        // (이때 closeOverlay는 isClosing을 true로 변경하고, 오버레이 컴포넌트는 애니메이션을 시작합니다.)
        // 중요한 점: 여기서는 `overlayType`과 `id`를 명시적으로 전달하여 닫기 요청
        const overlaysToClose = [];
        if (openOverlays.size > 0) {
            for (const [type, typeMap] of openOverlays.entries()) {
                for (const [id] of typeMap.entries()) {
                    const overlayData = typeMap.get(id);
                    if (!overlayData.isClosing) {
                        overlaysToClose.push({ type, id, overlayData }); // overlayData도 함께 전달하여 추후 활용
                    }
                }
            }
        }
        
        // 오버레이 닫기 요청 (isClosing 상태만 변경)
        overlaysToClose.forEach(({ type, id }) => {
             closeOverlay(type, id);
        });

        // 현재 경로와 이동하려는 경로가 동일하면
        if (isSamePath) {
            // 이 경우가 핵심입니다.
            // 동일 페이지로 이동 요청 시, 오버레이를 열면서 쌓인 히스토리 엔트리를 제거합니다.
            // 이 로직은 `useOverlayHistory`의 `requestCloseOverlay`에 의존하지 않고
            // `MapsWithClose`에서 직접 처리합니다.
            // 오버레이가 실제로 히스토리에 푸시되었다고 가정하고,
            // 그 히스토리 엔트리를 제거하기 위해 `window.history.back()`을 직접 호출합니다.
            // 단, `window.history.state`를 확인하여 현재 최상단 상태가 오버레이에 대한 것일 때만 수행합니다.
            // (즉, 뒤로가기를 누르면 오버레이가 닫히는 상황)
            if (window.history.state?.overlayType !== undefined && window.history.state?.overlayId !== undefined) {
                 window.history.back();
            }
            return; // 라우팅 없이 함수 종료
        }

        // 라우팅 정보를 `pendingNavigationRef`에 저장하여 오버레이가 모두 닫힐 때까지 대기
        pendingNavigationRef.current = { path, options: { state: { noTransition: true } } };
    };

    return { navigateWithClose }; // 외부에서 오버레이를 닫고 라우팅할 때 사용할 함수를 반환합니다.
}