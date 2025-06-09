import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { useOverlay } from "@/contexts/OverlayContext"; // OverlayContext에서 useOverlay 훅 임포트
import Header from "@/components/Header";
import SideDrawer from "@/components/SideDrawer"; // SideDrawer 컴포넌트 임포트
import MyModalComponent from "@/components/MyModalComponent"; // MyModalComponent 임포트

export default function Home() {
    const { openOverlay } = useOverlay(); // OverlayContext에서 openOverlay 함수 가져오기

    // 사이드 드로어를 여는 핸들러 함수
    const handleOpenSideDrawer = () => {
        // openOverlay 호출 시:
        // - "drawer": 오버레이의 타입 (임의로 지정)
        // - "mainSideDrawer": 오버레이의 고유 ID (같은 타입 내에서 유일해야 함)
        // - SideDrawer: 렌더링할 실제 컴포넌트
        // - { someCustomProp: "value" }: SideDrawer 컴포넌트에 전달할 추가 props (선택 사항)
        openOverlay("drawer", "mainSideDrawer", SideDrawer, { someCustomProp: "value" });
    };

    // 로그인 모달을 여는 핸들러 함수
    const handleOpenLoginModal = () => {
        // openOverlay 호출 시:
        // - "modal": 오버레이의 타입
        // - "myLoginModal": 오버레이의 고유 ID
        // - MyModalComponent: 렌더링할 실제 컴포넌트
        // - { initialData: "login" }: MyModalComponent에 전달할 추가 props
        openOverlay("modal", "myLoginModal", MyModalComponent, { initialData: "login" });
    };

    return (
        <Box className="layout">
            <Header >
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
        </Box>
    );
}