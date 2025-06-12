// src/AppRouter.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "@/hooks/usePageTransition";
import { ScrollRestorationProvider } from "@/contexts/ScrollRestorationContext"; // 프로바이더 임포트
import Box from '@mui/material/Box';

// 페이지 컴포넌트 임포트
import Home from "../pages/Home";
import Components from "../pages/Components";
import Buttons from "../pages/Buttons";
import Profiles from "../pages/Profiles";

const ROOT_MENUS = ['/', '/Components'];

export default function AppRouter() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();

    // 상태 제거용 replace (딱 한 번)
    // 이펙트가 너무 자주 실행되지 않도록 의존성을 최소화하고, 필요한 경우에만 실행되도록 조정
    useEffect(() => {
        // location.state가 존재하고, noTransition 속성이 명시적으로 true인 경우에만 작동
        if (location.state && location.state.noTransition) {
            const newState = { ...location.state };
            delete newState.noTransition; // noTransition 속성 제거

            console.log(
                "🧼 Cleaning up state and preserving transitionClassName:",
                newState
            );

            // 현재 경로와 검색 쿼리를 유지하며 상태만 업데이트 (replace)
            navigate(location.pathname + location.search, {
                replace: true, // 현재 히스토리 엔트리를 대체
                state: newState, // noTransition이 제거된 새 상태
            });
        }
    }, [location.state, navigate, location.pathname, location.search]); // location.pathname, location.search는 state가 변경될 때 함께 변경되므로 굳이 의존성에 포함시키지 않음

    const {
        nodeRef,
        transitionClassNames,
        transitionTimeout,
        pageTypeClass,
    } = usePageTransition(location, navigationType, ROOT_MENUS, location.state?.noTransition ?? false);

    return (
        // ScrollRestorationProvider로 전체 앱을 래핑합니다.
        <ScrollRestorationProvider>
            <TransitionGroup
                component={null}
                childFactory={(child) =>
                    React.cloneElement(child, {
                        classNames: transitionClassNames,
                        timeout: transitionTimeout,
                    })
                }
            >
                <CSSTransition
                    key={location.pathname}
                    nodeRef={nodeRef}
                    timeout={transitionTimeout}
                    unmountOnExit
                >
                    {/* `nodeRef`는 페이지 전환 애니메이션을 위한 최상위 컨테이너에 연결됩니다. */}
                    {/* 실제 스크롤은 각 페이지 내부의 `className="layout"` Box에서 처리됩니다. */}
                    <Box ref={nodeRef} className={`page ${pageTypeClass}`}>
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/Components" element={<Components />} />
                            <Route path="/Components/Buttons" element={<Buttons />} />
                            <Route path="/Profiles" element={<Profiles />} />
                        </Routes>
                    </Box>
                </CSSTransition>
            </TransitionGroup>
        </ScrollRestorationProvider>
    );
}