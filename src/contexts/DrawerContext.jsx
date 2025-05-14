import { createContext, useContext, useState } from "react";

// 1. Context 생성
const DrawerContext = createContext();

// 2. 커스텀 훅
export function useDrawer() {
	return useContext(DrawerContext);
}

// 3. Provider 컴포넌트
export function DrawerProvider({ children }) {
	const [isDrawerOpen, setDrawerOpen] = useState(false);

	return (
		<DrawerContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
			{children}
		</DrawerContext.Provider>
	);
}