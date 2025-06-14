import { createContext, useContext } from "react";

export const TransitionContext = createContext({
  transitionDone: true,          // ✅ 기본값 추가
  setTransitionDone: () => {}
});

export function TransitionProvider({ children, value }) {
  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
