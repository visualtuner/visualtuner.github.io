import Header from "../components/Header";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useOverlay } from "../contexts/OverlayContext";

export default function Home() {
    const { openOverlay } = useOverlay();

    const handleOpenSideDrawer = () => {
        openOverlay("drawer", "mainSideDrawer"); // 타입("drawer")과 ID("mainSideDrawer")를 전달합니다.
    };

    // 모달을 여는 함수 추가
    const handleOpenLoginModal = () => {
        openOverlay("modal", "myLoginModal"); // 타입("modal")과 ID("myLoginModal")를 전달합니다.
    };

    return (
        <>
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
        </>
    );
}