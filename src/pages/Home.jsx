import React, { useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { useOverlay } from "@/contexts/OverlayContext";
import Header from "@/components/Header";
import SideDrawer from "@/components/SideDrawer";
import MyModalComponent from "@/components/MyModalComponent";
import useScrollRestorationBehavior from "@/hooks/useScrollRestoration"; // 훅 임포트

export default function Home() {
    const { openOverlay } = useOverlay();
    const layoutRef = useRef(null);

    useScrollRestorationBehavior(layoutRef, true);

    const handleOpenSideDrawer = () => {
        openOverlay("drawer", "mainSideDrawer", SideDrawer, { someCustomProp: "value" });
    };

    const handleOpenLoginModal = () => {
        openOverlay("modal", "myLoginModal", MyModalComponent, { initialData: "login" });
    };

    return (
        <Box ref={layoutRef} className="layout">
            <Header>
                <IconButton aria-label="global side drawer" onClick={handleOpenSideDrawer}
                    sx={{
                        color: '#000',
                        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                            color: '#000',
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <p>홈</p>
            </Header>
            <h1>Home</h1>
            <p>헬로 리액트</p>
            <button onClick={handleOpenLoginModal}>로그인 모달 열기</button>

            <ol>
                <li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li>
            </ol>
        </Box>
    );
}