import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

export default function PageTransition({ children }) {
	const location = useLocation();
	const nodeRef = useRef(null);

	return (
        <TransitionGroup>
            <CSSTransition
                key={location.pathname}
                nodeRef={nodeRef}
                timeout={400}
                classNames="page page-transition"
                unmountOnExit
            >
                <div ref={nodeRef} className="">
                    {children}
                </div>
            </CSSTransition>
        </TransitionGroup>
	);
}