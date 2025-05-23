import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "../hooks/usePageTransition";
import Box from '@mui/material/Box';
import Home from "../pages/Home";
import Components from "../pages/Components";
import Buttons from "../pages/Buttons";

const ROOT_MENUS = ['/', '/Components'];

export default function AppRouter() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();

    // 상태 제거용 replace (딱 한 번)
    useEffect(() => {
        // location.state에 noTransition이나 fromDrawer와 같은 임시 상태가 있다면 제거
        if (location.state?.noTransition || location.state?.fromDrawer) {
            const newState = { ...location.state };
            delete newState.noTransition;
            delete newState.fromDrawer; // fromDrawer 상태도 제거

            // 변경된 state로 현재 위치를 replace합니다.
            // 이렇게 하면 새로고침 시에도 noTransition이나 fromDrawer 상태가 사라집니다.
            navigate(location.pathname + location.search, { replace: true, state: newState });
        }
    }, [location.pathname, location.search, location.state, navigate]); // 의존성 배열에 location.search와 location.state 추가

    const {
        nodeRef,
        transitionClassNames,
        transitionTimeout,
        pageTypeClass,
    } = usePageTransition(location, navigationType, ROOT_MENUS, location.state?.noTransition ?? false);

    return (
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
                <Box ref={nodeRef} className={`page ${pageTypeClass}`}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/Components" element={<Components />} />
                        <Route path="/Components/Buttons" element={<Buttons />} />
                    </Routes>
                </Box>
            </CSSTransition>
        </TransitionGroup>
    );
}