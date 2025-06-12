import { useEffect, useRef, useCallback } from 'react'; // useCallback 추가
import { useLocation, useNavigationType } from 'react-router-dom';
import { useScrollRestoration } from '@/contexts/ScrollRestorationContext';

export default function useScrollRestorationBehavior(scrollContainerRef, defaultRestore = true) {
    const {
        setScrollPosition,
        getScrollPosition
    } = useScrollRestoration();
    const location = useLocation();
    const navigationType = useNavigationType();

    // 현재 페이지의 스크롤 위치를 실시간으로 추적하는 useRef
    const currentScrollPosition = useRef(0);
    // 현재 (또는 이전) 경로를 추적하는 useRef
    const currentPathnameRef = useRef(location.pathname);

    // 스크롤 위치를 저장하는 콜백 함수 (useCallback으로 메모이제이션)
    const saveScroll = useCallback(() => {
        const path = currentPathnameRef.current;
        const scroll = currentScrollPosition.current;
        console.log(`[saveScroll Callback] Saving scroll for ${path}: ${scroll}`);
        setScrollPosition(path, scroll);
    }, [setScrollPosition]);


    const shouldRestoreScroll = location.state ?
        location.state.restoreScroll ?? defaultRestore :
        defaultRestore;

    // --- 1. 스크롤 이벤트 리스너를 추가하여 실시간으로 스크롤 위치 업데이트 ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            console.warn("Scroll container ref is null when scroll event listener effect runs.");
            return;
        }

        const handleScroll = () => {
            currentScrollPosition.current = container.scrollTop;
            // console.log(`[Scroll Event] Updated currentScrollPosition: ${currentScrollPosition.current}`);
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainerRef]);


    // --- 2. 페이지 진입 시 스크롤 복원 및 페이지 이동 전 스크롤 저장 ---
    // 이 useEffect는 페이지 경로가 변경될 때마다 실행됩니다.
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            console.warn("Scroll container ref is null when restoration effect runs.");
            return;
        }

        console.log(`[useEffect 2] Current Path: ${location.pathname}, Nav Type: ${navigationType}`);
        console.log(`[useEffect 2] container.scrollTop at effect start: ${container.scrollTop}`); // 이 시점엔 아직 0일 가능성 높음

        // 페이지 이동 시 (PUSH/REPLACE), 이전 페이지의 스크롤 위치 저장
        // (POP으로 돌아오는 경우나 직접 URL 입력 같은 경우는 이전 페이지의 클린업이 담당)
        if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
            const previousPath = currentPathnameRef.current;
            if (previousPath && previousPath !== location.pathname) {
                console.log(`[useEffect 2] Nav Type PUSH/REPLACE - Saving scroll for PREVIOUS path (${previousPath}): ${currentScrollPosition.current}`);
                setScrollPosition(previousPath, currentScrollPosition.current);
            }
        }
        // 현재 경로를 currentPathnameRef에 업데이트
        currentPathnameRef.current = location.pathname;


        let timeoutId;
        if (shouldRestoreScroll) {
            const storedPosition = getScrollPosition(location.pathname);
            console.log(`[useEffect 2] Should restore scroll. Stored position for ${location.pathname}: ${storedPosition}`);
            if (storedPosition !== undefined) {
                timeoutId = setTimeout(() => {
                    if (container) {
                         container.scrollTop = storedPosition;
                         console.log(`✨ Restored scroll for ${location.pathname} to: ${storedPosition}`);
                         // 복원 후 currentScrollPosition 업데이트 (스크롤 이벤트가 반영되기 전에 정확한 값을 설정)
                         currentScrollPosition.current = storedPosition;
                    } else {
                         console.warn(`Container null during setTimeout for restoration for ${location.pathname}.`);
                    }
                }, 0);
            } else {
                timeoutId = setTimeout(() => {
                    if (container) {
                         container.scrollTop = 0;
                         console.log(`🔝 No stored scroll for ${location.pathname}, scrolling to top.`);
                         currentScrollPosition.current = 0; // 초기화
                    } else {
                         console.warn(`Container null during setTimeout for scroll to top for ${location.pathname}.`);
                    }
                }, 0);
            }
        } else {
            console.log(`[useEffect 2] Scroll restoration disabled for ${location.pathname}.`);
            timeoutId = setTimeout(() => {
                if (container) {
                    container.scrollTop = 0;
                    console.log(`🚫 Scroll restoration disabled for ${location.pathname}, scrolling to top.`);
                    currentScrollPosition.current = 0; // 초기화
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
            console.log(`[useEffect 2 CLEANUP] Cleanup function for ${currentPathnameRef.current}.`);
            // 클린업 시점에 currentPathnameRef.current는 아직 이전 경로를 가리킴
            saveScroll(); // 메모이제이션된 saveScroll 콜백 호출
        };
    }, [location.pathname, navigationType, getScrollPosition, shouldRestoreScroll, scrollContainerRef, saveScroll]); // saveScroll 의존성 추가

    return {
        shouldRestoreScroll
    };
}