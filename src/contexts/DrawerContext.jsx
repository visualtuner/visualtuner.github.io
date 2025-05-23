import { createContext, useContext, useState, useCallback } from "react";

// 1. Context 생성
const DrawerContext = createContext();

// 2. 커스텀 훅
export function useDrawer() {
    return useContext(DrawerContext);
}

// 3. Provider 컴포넌트
export function DrawerProvider({ children }) {
    const [openDrawerId, setOpenDrawerId] = useState(null); // 현재 열려 있는 드로어의 ID를 저장합니다.

    // 드로어를 여는 함수
    const openDrawer = useCallback((id) => {
        setOpenDrawerId(id);
    }, []);

    // 드로어를 닫는 함수
    const closeDrawer = useCallback(() => {
        setOpenDrawerId(null);
    }, []);

    return (
        <DrawerContext.Provider value={{ openDrawerId, openDrawer, closeDrawer }}>
            {children}
        </DrawerContext.Provider>
    );
}