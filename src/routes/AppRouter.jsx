import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "@/hooks/usePageTransition";
import Box from '@mui/material/Box';
import Home from "@/pages/Home";
import Components from "@/pages/Components";
import Buttons from "@/pages/Buttons";
import Profiles from "@/pages/Profiles";

const ROOT_MENUS = ['/', '/Components'];

export default function AppRouter() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();
    const [transitionDone, setTransitionDone] = useState(false);

    const noTransition = location.state?.noTransition ?? false;

    useEffect(() => {
        if (noTransition) {
            const newState = { ...location.state };
            delete newState.noTransition;

            navigate(location.pathname + location.search, {
                replace: true,
                state: newState,
            });
        }
    }, [location.pathname, location.search, location.state, navigate, noTransition]);

    useEffect(() => {
        setTransitionDone(false); // 경로 변경 시 초기화
    }, [location.pathname]);

    const {
        nodeRef,
        transitionClassNames,
        transitionTimeout,
        pageTypeClass,
    } = usePageTransition(location, navigationType, ROOT_MENUS, noTransition);

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
                onEntered={() => setTransitionDone(true)}
            >
                <Box ref={nodeRef} className={`page ${pageTypeClass}`}>
                    <Routes location={location}>
                        <Route path="/" element={<Home transitionDone={transitionDone} />} />
                        <Route path="/Components" element={<Components transitionDone={transitionDone} />} />
                        <Route path="/Components/Buttons" element={<Buttons transitionDone={transitionDone} />} />
                        <Route path="/Profiles" element={<Profiles transitionDone={transitionDone} />} />
                    </Routes>
                </Box>
            </CSSTransition>
        </TransitionGroup>
    );
}