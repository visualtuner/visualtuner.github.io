// src/contexts/ScrollRestorationContext.jsx
import React, {
    createContext,
    useContext,
    useCallback,
    useRef
} from 'react';
import {
    useLocation
} from 'react-router-dom';

const ScrollRestorationContext = createContext(null);

export function ScrollRestorationProvider({
    children
}) {
    const scrollPositions = useRef(new Map());
    const location = useLocation();

    // 이 함수가 제대로 정의되었는지 확인
    const setScrollPosition = useCallback((path, position) => {
        scrollPositions.current.set(path, position);
        console.log(`💾 Saved scroll for ${path}: ${position}`);
    }, []); // 의존성 배열에 아무것도 없어야 합니다.

    // 이 함수가 제대로 정의되었는지 확인
    const getScrollPosition = useCallback((path) => {
        const position = scrollPositions.current.get(path);
        console.log(`👀 Retrieved scroll for ${path}: ${position}`);
        return position;
    }, []);

    const clearScrollPosition = useCallback((path) => {
        scrollPositions.current.delete(path);
        console.log(`🧹 Cleared scroll for ${path}`);
    }, []);

    const value = {
        setScrollPosition,
        getScrollPosition,
        clearScrollPosition,
        currentPathname: location.pathname,
    };

    return (
        <ScrollRestorationContext.Provider value={value}>
            {children}
        </ScrollRestorationContext.Provider>
    );
}

// useScrollRestoration 훅은 이제 이 파일에 없거나 (별도 파일로 분리),
// 아니면 아래와 같이 존재할 것입니다. (만약 이 파일에 있다면)
export function useScrollRestoration() {
    const context = useContext(ScrollRestorationContext);
    if (!context) {
        throw new Error('useScrollRestoration must be used within a ScrollRestorationProvider');
    }
    return context;
}