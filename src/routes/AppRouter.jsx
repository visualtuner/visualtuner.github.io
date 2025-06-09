import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import usePageTransition from "@/hooks/usePageTransition";
import Box from '@mui/material/Box';
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
    useEffect(() => {
		if (location.state?.noTransition) {
			const newState = { ...location.state };
			delete newState.noTransition;

			console.log(
				"🧼 Cleaning up state and preserving transitionClassName:",
				newState
			);

			navigate(location.pathname + location.search, {
				replace: true,
				state: newState,
			});
		}
	}, [location.pathname, location.search, location.state, navigate]);

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
                        <Route path="/Profiles" element={<Profiles />} />
                    </Routes>
                </Box>
            </CSSTransition>
        </TransitionGroup>
    );
}
