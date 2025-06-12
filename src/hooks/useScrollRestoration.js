// src/hooks/useScrollRestoration.js
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useScrollRestoration } from '@/contexts/ScrollRestorationContext';

export default function useScrollRestorationBehavior(scrollContainerRef, defaultRestore = true) {
    const {
        setScrollPosition,
        getScrollPosition
    } = useScrollRestoration();
    const location = useLocation();
    const navigationType = useNavigationType();

    // 현재 (또는 이전) 경로를 추적하는 useRef
    const currentPathnameRef = useRef(location.pathname);
    // 마지막으로 복원된 스크롤 값을 저장하여, Strict Mode 클린업에서 0으로 덮어쓰는 것을 방지
    const lastRestoredScrollPosition = useRef(undefined); // 스크롤 이벤트 리스너 제거로 0이 되는 타이밍을 잡기 위함

    // 스크롤 위치를 저장하는 콜백 함수 (useCallback으로 메모이제이션)
    const saveScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            console.warn("[saveScroll Callback] Scroll container ref is null. Cannot save scroll.");
            return;
        }

        const path = currentPathnameRef.current;
        let scroll = container.scrollTop; // container.scrollTop을 직접 읽음

        // Strict Mode의 이중 클린업 시 0으로 덮어쓰는 것을 방지
        // 개발 환경에서만 작동하며, 스크롤 값이 0이고 이전에 복원된 값이 있다면 그 값을 사용
        if (process.env.NODE_ENV === 'development' && scroll === 0 && lastRestoredScrollPosition.current !== undefined) {
             console.warn(`[saveScroll Callback] Detected potential Strict Mode 0 overwrite for ${path}. Using last restored value: ${lastRestoredScrollPosition.current}`);
             scroll = lastRestoredScrollPosition.current;
             lastRestoredScrollPosition.current = undefined; // 사용했으니 초기화하여 다음에는 다시 0으로 저장되지 않도록
        }

        console.log(`[saveScroll Callback] Saving scroll for ${path}: ${scroll}`);
        setScrollPosition(path, scroll);
    }, [setScrollPosition, scrollContainerRef]); // scrollContainerRef도 의존성에 추가

    const shouldRestoreScroll = location.state ?
        location.state.restoreScroll ?? defaultRestore :
        defaultRestore;

    // --- 페이지 진입 시 스크롤 복원 및 페이지 이동 전 스크롤 저장 ---
    // 이 useEffect는 페이지 경로가 변경될 때마다 실행됩니다.
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            console.warn("Scroll container ref is null when restoration effect runs.");
            return;
        }

        console.log(`[useEffect] Current Path: ${location.pathname}, Nav Type: ${navigationType}`);
        console.log(`[useEffect] container.scrollTop at effect start: ${container.scrollTop}`);

        // 페이지 이동 시 (PUSH/REPLACE), 이전 페이지의 스크롤 위치 저장
        // (POP으로 돌아오는 경우나 직접 URL 입력 같은 경우는 클린업이 담당)
        if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
            const previousPath = currentPathnameRef.current;
            if (previousPath && previousPath !== location.pathname) {
                console.log(`[useEffect] Nav Type PUSH/REPLACE - Triggering saveScroll for PREVIOUS path (${previousPath}).`);
                // 이전 경로의 스크롤을 바로 저장 (클린업보다 먼저 실행될 가능성)
                saveScroll();
            }
        }
        // 항상 현재 경로를 currentPathnameRef에 업데이트
        currentPathnameRef.current = location.pathname;


        let timeoutId;
        if (shouldRestoreScroll) {
            const storedPosition = getScrollPosition(location.pathname);
            console.log(`[useEffect] Should restore scroll. Stored position for ${location.pathname}: ${storedPosition}`);
            if (storedPosition !== undefined) {
                timeoutId = setTimeout(() => {
                    if (container) {
                         container.scrollTop = storedPosition;
                         console.log(`✨ Restored scroll for ${location.pathname} to: ${storedPosition}`);
                         lastRestoredScrollPosition.current = storedPosition; // 마지막으로 복원된 값 기록
                    } else {
                         console.warn(`Container null during setTimeout for restoration for ${location.pathname}.`);
                    }
                }, 0);
            } else {
                timeoutId = setTimeout(() => {
                    if (container) {
                         container.scrollTop = 0;
                         console.log(`🔝 No stored scroll for ${location.pathname}, scrolling to top.`);
                         lastRestoredScrollPosition.current = 0; // 0도 복원된 값으로 기록
                    } else {
                         console.warn(`Container null during setTimeout for scroll to top for ${location.pathname}.`);
                    }
                }, 0);
            }
        } else {
            console.log(`[useEffect] Scroll restoration disabled for ${location.pathname}.`);
            timeoutId = setTimeout(() => {
                if (container) {
                    container.scrollTop = 0;
                    console.log(`🚫 Scroll restoration disabled for ${location.pathname}, scrolling to top.`);
                    lastRestoredScrollPosition.current = 0; // 0도 복원된 값으로 기록
                } else {
                    console.warn(`Container null during setTimeout for disabled restoration for ${location.pathname}.`);
                }
            }, 0);
        }

        // --- 클린업 함수: 컴포넌트 언마운트/경로 변경 시 스크롤 위치 저장 ---
        // 이 클린업은 StrictMode에서 두 번 실행될 수 있으므로, saveScroll 콜백을 직접 호출
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            console.log(`[useEffect CLEANUP] Cleanup function for ${currentPathnameRef.current}.`);
            // 클린업 시점에 currentPathnameRef.current는 언마운트될 경로를 가리킴
            saveScroll(); // 메모이제이션된 saveScroll 콜백 호출
        };
    }, [location.pathname, navigationType, getScrollPosition, shouldRestoreScroll, scrollContainerRef, saveScroll]);

    return {
        shouldRestoreScroll
    };
}