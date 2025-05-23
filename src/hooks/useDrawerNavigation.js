import { useDrawer } from "../contexts/DrawerContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react"; // useRef 추가

export default function useDrawerNavigation() {
    const { openDrawerId, closeDrawer } = useDrawer(); // openDrawerId도 가져와 현재 열린 드로어를 확인
    const navigate = useNavigate();
    const location = useLocation();

    // 네비게이션 요청을 잠시 저장해두는 ref
    const pendingNavigationRef = useRef(null);

    // openDrawerId 변경 감지하여 pendingNavigation 처리
    useEffect(() => {
        // 드로어가 닫혔고, 대기 중인 네비게이션 요청이 있다면 실행
        if (!openDrawerId && pendingNavigationRef.current) {
            const { path, options } = pendingNavigationRef.current;
            navigate(path, options);
            pendingNavigationRef.current = null; // 요청 처리 후 초기화
        }
    }, [openDrawerId, navigate]);


    const navigateWithClose = (path) => {
        const isSamePath = location.pathname === path;

        // 드로어가 현재 열려있지 않다면 (혹은 다른 드로어라면) 바로 navigate
        if (!openDrawerId) {
            navigate(path, { state: { noTransition: true } });
            return;
        }

        // 같은 경로로 이동하는 경우: 드로어만 닫고 페이지 이동 없음
        if (isSamePath) {
            closeDrawer(); // 글로벌 드로어 닫기 요청
            return;
        }

        // 다른 경로로 이동하는 경우
        // 1. 글로벌 드로어 닫기 요청
        //    -> useDrawerHistory의 useEffect가 isOpen === false를 감지하고
        //       window.history.back()을 호출하여 드로어 히스토리 엔트리를 제거할 것.
        closeDrawer();

        // 2. 페이지 이동 요청을 대기열에 추가
        //    -> 드로어 닫는 로직(특히 history.back())이 완료된 후 openDrawerId가 null이 되면
        //       위의 useEffect가 이 요청을 처리할 것.
        pendingNavigationRef.current = { path, options: { state: { noTransition: true } } };
    };

    return { navigateWithClose };
}