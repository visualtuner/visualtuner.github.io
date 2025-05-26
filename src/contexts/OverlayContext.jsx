import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

// OverlayContext 생성: 이 Context를 통해 오버레이 관련 상태와 함수에 접근합니다.
export const OverlayContext = createContext();

// useOverlay 훅: 컴포넌트에서 OverlayContext의 값을 쉽게 사용할 수 있도록 하는 헬퍼 훅입니다.
export function useOverlay() {
    return useContext(OverlayContext);
}

// OverlayProvider 컴포넌트: React 트리의 최상단 근처에 래핑되어야 합니다.
// 자식 컴포넌트들에게 오버레이 상태를 제공하고, OverlayContainer를 렌더링합니다.
export function OverlayProvider({ children }) {
    // openOverlays 상태: 현재 열려 있거나 닫힘 애니메이션 중인 모든 오버레이를 관리합니다.
    // Map<type, Map<id, { Component: React.ComponentType, props: object, isClosing: boolean }>>
    // - type: 오버레이의 종류 (예: "modal", "drawer")
    // - id: 각 오버레이의 고유 식별자 (예: "myLoginModal", "mainSideDrawer")
    // - Component: 렌더링할 실제 React 컴포넌트
    // - props: 해당 컴포넌트에 전달될 props
    // - isClosing: 오버레이가 닫힘 애니메이션 중인지를 나타내는 불리언 값 (true이면 닫힘 애니메이션 중)
    const [openOverlays, setOpenOverlays] = useState(new Map());

    // openOverlay 함수: 특정 타입과 ID의 오버레이를 엽니다.
    // Component와 props를 함께 전달받아, 해당 오버레이가 렌더링될 때 사용될 정보를 저장합니다.
    const openOverlay = useCallback((type, id, Component, props = {}) => {
        setOpenOverlays(prev => {
            const newPrev = new Map(prev); // 이전 상태의 Map을 복사하여 불변성 유지
            const typeMap = new Map(newPrev.get(type) || []); // 해당 타입의 Map을 복사 또는 새로 생성
            // 열 때 isClosing은 false로 설정합니다.
            typeMap.set(id, { Component, props, isClosing: false });
            newPrev.set(type, typeMap);
            return newPrev; // 새로운 상태 Map을 반환하여 React 렌더링 트리거
        });
    }, []); // 의존성 배열이 비어 있으므로, 컴포넌트 마운트 시 한 번만 생성됩니다.

    // closeOverlay 함수: 특정 타입과 ID의 오버레이를 닫기 시작합니다 (애니메이션 트리거).
    // 이 함수는 오버레이를 즉시 Map에서 제거하지 않고, isClosing 상태를 true로 변경하여 닫힘 애니메이션을 시작합니다.
    const closeOverlay = useCallback((type, id) => {
        setOpenOverlays(prev => {
            const newPrev = new Map(prev);
            const typeMap = new Map(newPrev.get(type) || []);

            if (typeMap.has(id)) {
                const overlayData = typeMap.get(id);
                // 해당 오버레이의 isClosing 상태를 true로 변경하여 닫힘 애니메이션을 트리거합니다.
                typeMap.set(id, { ...overlayData, isClosing: true });
                newPrev.set(type, typeMap);
            }
            return newPrev;
        });
    }, []);

    // removeOverlay 함수: 닫힘 애니메이션이 완료된 후 오버레이를 실제로 제거합니다 (DOM에서 언마운트).
    // 이 함수는 오버레이 컴포넌트 내부에서 닫힘 애니메이션이 끝났을 때 호출됩니다.
    const removeOverlay = useCallback((type, id) => {
        setOpenOverlays(prev => {
            const newPrev = new Map(prev);
            const typeMap = new Map(newPrev.get(type) || []);
            typeMap.delete(id); // Map에서 해당 오버레이 제거

            // 해당 타입에 더 이상 열린 오버레이가 없으면, 그 타입 Map 자체를 제거합니다.
            if (typeMap.size === 0) {
                newPrev.delete(type);
            } else {
                newPrev.set(type, typeMap);
            }
            return newPrev;
        });
    }, []);

    // closeAllOverlays 함수: 현재 열려 있는 모든 오버레이를 닫기 대기 상태로 전환합니다.
    // 이는 모든 오버레이에 대해 닫힘 애니메이션을 트리거합니다.
    const closeAllOverlays = useCallback(() => {
        setOpenOverlays(prev => {
            const newPrev = new Map(prev);
            for (const [type, typeMap] of newPrev.entries()) {
                for (const [id, overlayData] of typeMap.entries()) {
                    // 각 오버레이의 isClosing 상태를 true로 변경합니다.
                    typeMap.set(id, { ...overlayData, isClosing: true });
                }
            }
            return newPrev;
        });
    }, []);

    // isOverlayOpen 함수: 특정 오버레이가 현재 "열린" 상태인지 확인합니다.
    // 여기서 '열린' 상태는 Map에 존재하고, isClosing이 false인 경우를 의미합니다.
    const isOverlayOpen = useCallback((type, id) => {
        const overlay = openOverlays.get(type)?.get(id);
        return !!overlay && !overlay.isClosing;
    }, [openOverlays]); // openOverlays 상태가 변경될 때마다 함수를 새로 생성합니다.

    // Context.Provider를 통해 제공할 값들입니다.
    const value = {
        openOverlays,      // 현재 열린/닫힘 애니메이션 중인 오버레이 Map
        openOverlay,       // 오버레이를 여는 함수
        closeOverlay,      // 오버레이 닫힘 애니메이션을 트리거하는 함수
        removeOverlay,     // 오버레이를 DOM에서 완전히 제거하는 함수
        closeAllOverlays,  // 모든 오버레이를 닫는 함수
        isOverlayOpen      // 특정 오버레이가 열려있는지 확인하는 함수
    };

    return (
        <OverlayContext.Provider value={value}>
            {children}
            <OverlayContainer />
        </OverlayContext.Provider>
    );
}

// OverlayContainer 컴포넌트: OverlayProvider 내부에 위치하며, openOverlays 상태를 기반으로
// 실제 오버레이 컴포넌트들을 동적으로 렌더링합니다.
function OverlayContainer() {
    const { openOverlays, removeOverlay } = useOverlay();

    const renderedOverlays = []; // 렌더링할 오버레이 컴포넌트들을 담을 배열
    let zIndexCounter = 1000; // 오버레이들의 z-index를 관리하여 항상 최상단에 보이도록 합니다.

    // openOverlays Map을 순회하며 각 오버레이 컴포넌트를 렌더링합니다.
    for (const [type, typeMap] of openOverlays.entries()) {
        for (const [id, { Component, props, isClosing }] of typeMap.entries()) {
            const uniqueKey = `${type}-${id}`; // React key로 사용할 고유 ID
            renderedOverlays.push(
                <Component
                    key={uniqueKey}
                    id={id}
                    overlayType={type}
                    isOpen={!isClosing} // isClosing이 true면 isOpen은 false가 되어 닫힘 애니메이션 트리거
                    onClose={() => removeOverlay(type, id)} // 오버레이 컴포넌트의 닫힘 애니메이션 완료 시 호출될 콜백
                    style={{ zIndex: zIndexCounter++ }} // z-index 동적 할당
                    {...props} // Component를 열 때 전달받았던 props를 그대로 전달
                />
            );
        }
    }

    return <>{renderedOverlays}</>; // 배열에 담긴 오버레이 컴포넌트들을 렌더링
}