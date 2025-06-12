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

    const currentPathnameRef = useRef(location.pathname);
    // 이 ref는 "마지막으로 복원되었거나, 페이지 이동 직전에 저장될 것으로 예상되는 스크롤 값"을 추적합니다.
    const latestScrollValueRef = useRef(0); // 0으로 초기화하여 항상 어떤 값이든 가지도록

    // Strict Mode 이중 실행 시 0 저장 방지를 위한 플래그 (개발 환경 전용)
    const isSavingForStrictModeCleanup = useRef(false);

    const saveScroll = useCallback((path, scrollValueToSave) => {
        // 이 함수가 호출될 때 container.scrollTop이 null일 수 있으므로,
        // 이미 저장되어 전달된 scrollValueToSave를 우선 사용합니다.
        let scroll = scrollValueToSave;

        // 만약 scrollValueToSave가 undefined라면, 최신 값을 latestScrollValueRef에서 가져옵니다.
        // 클린업 시점에는 latestScrollValueRef에 저장된 값이 유효할 확률이 높습니다.
        if (scroll === undefined) {
            scroll = latestScrollValueRef.current;
        }

        // 개발 환경 (Strict Mode)에서 cleanup이 두 번 호출될 때 0으로 덮어쓰는 것을 방지
        if (process.env.NODE_ENV === 'development' && scroll === 0 && latestScrollValueRef.current !== undefined && latestScrollValueRef.current !== 0) {
             console.warn(`[saveScroll Callback] Detected potential Strict Mode 0 overwrite for ${path}. Using latest value: ${latestScrollValueRef.current}`);
             scroll = latestScrollValueRef.current;
             // 이 값을 사용했으므로 바로 초기화하여 다음 저장 시에는 영향을 주지 않도록
             // (latestScrollValueRef.current는 이후에 다시 업데이트될 것이므로 here)
             isSavingForStrictModeCleanup.current = true; // Strict Mode의 두 번째 클린업임을 표시
        }

        console.log(`[saveScroll Callback] Saving scroll for ${path}: ${scroll}`);
        setScrollPosition(path, scroll);
    }, [setScrollPosition]);

    const shouldRestoreScroll = location.state ?
        location.state.restoreScroll ?? defaultRestore :
        defaultRestore;

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            console.warn("Scroll container ref is null when effect runs.");
            return;
        }

        console.log(`[useEffect] Current Path: ${location.pathname}, Nav Type: ${navigationType}`);
        console.log(`[useEffect] container.scrollTop at effect start: ${container.scrollTop}`);

        // --- 중요: 현재 페이지의 스크롤 위치를 `latestScrollValueRef`에 계속 업데이트 ---
        // 스크롤 이벤트 리스너를 직접 붙이는 대신,
        // 페이지가 마운트되어 있는 동안 스크롤이 발생하면 이 ref를 업데이트합니다.
        // `requestAnimationFrame`을 사용하여 스크롤 이벤트를 최적화합니다.
        let animationFrameId;
        const updateScrollPosition = () => {
            if (container) {
                latestScrollValueRef.current = container.scrollTop;
                // console.log(`[RAF Update] latestScrollValueRef updated to: ${latestScrollValueRef.current}`);
                animationFrameId = requestAnimationFrame(updateScrollPosition);
            }
        };

        // DOM이 준비된 후에 스크롤 업데이트를 시작합니다.
        animationFrameId = requestAnimationFrame(updateScrollPosition);


        // 페이지 이동 시 (PUSH/REPLACE), 이전 페이지의 스크롤 위치 저장
        if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
            const previousPath = currentPathnameRef.current;
            if (previousPath && previousPath !== location.pathname) {
                console.log(`[useEffect] Nav Type PUSH/REPLACE - Triggering saveScroll for PREVIOUS path (${previousPath}).`);
                // 이전 경로의 스크롤을 바로 저장: latestScrollValueRef.current의 값을 사용
                saveScroll(previousPath, latestScrollValueRef.current);
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
                         latestScrollValueRef.current = storedPosition; // 복원 후 최신 값으로 업데이트
                    } else {
                         console.warn(`Container null during setTimeout for restoration for ${location.pathname}.`);
                    }
                }, 0);
            } else {
                timeoutId = setTimeout(() => {
                    if (container) {
                         container.scrollTop = 0;
                         console.log(`🔝 No stored scroll for ${location.pathname}, scrolling to top.`);
                         latestScrollValueRef.current = 0; // 초기화 후 최신 값으로 업데이트
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
                    latestScrollValueRef.current = 0; // 초기화 후 최신 값으로 업데이트
                } else {
                    console.warn(`Container null during setTimeout for disabled restoration for ${location.pathname}.`);
                }
            }, 0);
        }

        // --- 클린업 함수: 컴포넌트 언마운트/경로 변경 시 스크롤 위치 저장 ---
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId); // 애니메이션 프레임 요청 취소
            }

            console.log(`[useEffect CLEANUP] Cleanup function for ${currentPathnameRef.current}.`);

            // Strict Mode의 두 번째 클린업 호출인 경우 저장하지 않음
            if (process.env.NODE_ENV === 'development' && isSavingForStrictModeCleanup.current) {
                console.log(`[useEffect CLEANUP] Skipping save for Strict Mode second cleanup.`);
                isSavingForStrictModeCleanup.current = false; // 플래그 초기화
                return;
            }

            // 클린업 시점에 `latestScrollValueRef.current`에는 언마운트 직전의 스크롤 값이 들어있을 것으로 예상됩니다.
            saveScroll(currentPathnameRef.current, latestScrollValueRef.current);
        };
    }, [location.pathname, navigationType, getScrollPosition, shouldRestoreScroll, scrollContainerRef, saveScroll]);

    return {
        shouldRestoreScroll
    };
}