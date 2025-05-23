import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDrawer } from "../contexts/DrawerContext";

export default function useDrawerHistory(drawerId, isOpen, onClose) {
    const { openDrawer: setGlobalDrawerOpen, closeDrawer: setGlobalDrawerClose } = useDrawer();
    const location = useLocation();

    const isDrawerOpenRef = useRef(isOpen);
    useEffect(() => {
        isDrawerOpenRef.current = isOpen;
    }, [isOpen]);

    // 드로어 열림/닫힘에 따른 브라우저 히스토리 관리
    useEffect(() => {
        if (isOpen) {
            // 드로어가 열릴 때만 히스토리 스택에 추가
            if (window.history.state?.drawerId !== drawerId) {
                // *** 핵심 수정: 세 번째 인자 (URL)를 생략합니다. ***
                // 이렇게 하면 현재 브라우저의 URL을 변경하지 않고 state만 추가됩니다.
                window.history.pushState({ drawerId: drawerId, fromDrawer: true, prevPath: location.pathname + location.search }, "");
                setGlobalDrawerOpen(drawerId); // 글로벌 컨텍스트 업데이트
            }
        } else {
            // 드로어가 닫힐 때, 현재 히스토리 상태가 이 드로어에 대한 것이면 pop
            if (window.history.state?.drawerId === drawerId) {
                window.history.back(); // 드로어를 위한 히스토리 엔트리를 제거
            }
            // 글로벌 컨텍스트 업데이트는 popstate 핸들러 또는 명시적 닫기에서 처리
        }
    }, [isOpen, drawerId, location.pathname, location.search, setGlobalDrawerOpen]);

    // 브라우저 뒤로가기 버튼 처리 (popstate)
    const handlePopState = useCallback((event) => {
        const state = event.state;
        const currentOpenDrawer = isDrawerOpenRef.current;

        if (currentOpenDrawer && (state === null || state.drawerId !== drawerId)) {
            onClose(); // 해당 드로어 컴포넌트의 onClose 호출
            setGlobalDrawerClose(); // 글로벌 컨텍스트 업데이트
        }
    }, [drawerId, onClose, setGlobalDrawerClose]);

    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [handlePopState]);

    // 드로어를 외부에서 닫도록 요청하는 함수 (클릭, 스와이프 등)
    const requestCloseDrawer = useCallback(() => {
        if (window.history.state?.drawerId === drawerId) {
            window.history.back(); // popstate 이벤트가 발생하여 handlePopState를 트리거할 것
        } else {
            onClose();
            setGlobalDrawerClose();
        }
    }, [drawerId, onClose, setGlobalDrawerClose]);

    return { requestCloseDrawer };
}