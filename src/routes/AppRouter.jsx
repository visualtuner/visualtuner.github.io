import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "@/hooks/usePageTransition";
import Box from '@mui/material/Box';
import Home from "@/pages/Home";
import Components from "@/pages/Components";
import Buttons from "@/pages/Buttons";
import Profiles from "@/pages/Profiles";

// 페이지별 스크롤 위치 저장소 (pathname 기준)
const scrollPositions = new Map();

const ROOT_MENUS = ['/', '/Components'];

export default function AppRouter() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();
    const [transitionDone, setTransitionDone] = useState(false);

    const {
        nodeRef,
        transitionClassNames,
        transitionTimeout,
        pageTypeClass,
    } = usePageTransition(location, navigationType, ROOT_MENUS, location.state?.noTransition ?? false);

    // noTransition 플래그 제거
    useEffect(() => {
        if (location.state?.noTransition) {
            const newState = { ...location.state };
            delete newState.noTransition;
            navigate(location.pathname + location.search, {
                replace: true,
                state: newState,
            });
        }
    }, [location.pathname, location.search, location.state, navigate]);

    // 경로 변경 시 트랜지션 초기화
    useEffect(() => {
        setTransitionDone(false);
        console.log(`[🔄 transitionDone: false] pathname: ${location.pathname}`);
    }, [location.pathname]);

    // 스크롤 저장 (컴포넌트 exit 직전)
    const handleExit = () => {
        const el = nodeRef.current;
        if (el) {
            const scrollEl = el.querySelector(".layout");
            if (scrollEl) {
                const y = scrollEl.scrollTop;
                scrollPositions.set(location.pathname, y); // ✅ pathname 기준
                console.log(`[📦 Save onExit] path: ${location.pathname}, scrollTop: ${y}`);
            }
        }
    };

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
                onExit={handleExit}
                onEntered={() => {
                    setTransitionDone(true);
                    console.log(`[🎬 transitionDone: true] onEntered for ${location.pathname}`);
                }}
            >
                <Box ref={nodeRef} className={`page ${pageTypeClass}`}>
                    <Routes location={location}>
                        <Route path="/" element={<Home transitionDone={transitionDone} scrollPositions={scrollPositions} />} />
                        <Route path="/Components" element={<Components transitionDone={transitionDone} scrollPositions={scrollPositions} />} />
                        <Route path="/Components/Buttons" element={<Buttons transitionDone={transitionDone} scrollPositions={scrollPositions} />} />
                        <Route path="/Profiles" element={<Profiles transitionDone={transitionDone} scrollPositions={scrollPositions} />} />
                    </Routes>
                </Box>
            </CSSTransition>
        </TransitionGroup>
    );
}
