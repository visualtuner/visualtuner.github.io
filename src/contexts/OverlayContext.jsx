import { createContext, useContext, useState, useCallback } from "react";

// 1. Context 생성
export const OverlayContext = createContext();

// 2. 커스텀 훅 (Provider와 같은 파일에 위치)
export function useOverlay() {
    return useContext(OverlayContext);
}

// 3. Provider 컴포넌트
export function OverlayProvider({ children }) {
    // { type: { id: true/false } } 형태로 관리 (예: { "drawer": { "mainSideDrawer": true }, "modal": { "loginModal": false } })
    const [openOverlays, setOpenOverlays] = useState({});

    // 특정 타입의 특정 오버레이를 여는 함수
    const openOverlay = useCallback((type, id) => {
        setOpenOverlays(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [id]: true
            }
        }));
    }, []);

    // 특정 타입의 특정 오버레이를 닫는 함수
    const closeOverlay = useCallback((type, id) => {
        setOpenOverlays(prev => {
            // 해당 타입의 오버레이가 없으면 그대로 반환
            if (!prev[type]) return prev;

            const newTypeOverlays = { ...prev[type] };
            delete newTypeOverlays[id];

            // 만약 해당 타입에 더 이상 열린 오버레이가 없으면 해당 타입을 객체에서 제거
            if (Object.keys(newTypeOverlays).length === 0) {
                const newOverlays = { ...prev };
                delete newOverlays[type];
                return newOverlays;
            }

            return {
                ...prev,
                [type]: newTypeOverlays
            };
        });
    }, []);

    // 모든 오버레이를 닫는 함수
    const closeAllOverlays = useCallback(() => {
        setOpenOverlays({});
    }, []);

    // 특정 오버레이가 열려 있는지 확인하는 함수
    const isOverlayOpen = useCallback((type, id) => {
        return !!openOverlays[type]?.[id];
    }, [openOverlays]);


    const value = {
        openOverlays,
        openOverlay,
        closeOverlay,
        closeAllOverlays,
        isOverlayOpen
    };

    return (
        <OverlayContext.Provider value={value}>
            {children}
        </OverlayContext.Provider>
    );
}