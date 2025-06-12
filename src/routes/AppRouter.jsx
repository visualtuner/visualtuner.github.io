import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "@/hooks/usePageTransition";
import Box from '@mui/material/Box';
import Home from "@/pages/Home";
import Components from "@/pages/Components";
import Buttons from "@/pages/Buttons";
import Profiles from "@/pages/Profiles";

// 스크롤 위치 저장소 (메모리 기반)
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

    // noTransition 처리
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

    // 경로 바뀌면 트랜지션 초기화
    useEffect(() => {
        setTransitionDone(false);
        console.log(`[🔄 transitionDone: false] pathname: ${location.pathname}`);
    }, [location.pathname]);

    // 스크롤 저장: exit 시점
    const handleExit = () => {
        const el = nodeRef.current;
        if (el) {
            const scrollEl = el.querySelector(".layout");
            if (scrollEl) {
                const y = scrollEl.scrollTop;
                scrollPositions.set(location.key, y);
                console.log(`[📦 Save onExit] key: ${location.key}, scrollTop: ${y}`);
            } else {
                console.warn("[⚠️ handleExit] .layout 요소를 찾지 못함");
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
                onExit={handleExit} // ✅ 스크롤 저장 위치
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
