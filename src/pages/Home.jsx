import Header from "../components/Header";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDrawer } from "../contexts/DrawerContext"; // useDrawer 훅을 가져옵니다.

export default function Home() {
    // useDrawer 훅에서 openDrawer 함수를 구조 분해 할당으로 가져옵니다.
    const { openDrawer } = useDrawer();

    // 사이드 드로어를 여는 함수
    const handleOpenSideDrawer = () => {
        openDrawer("mainSideDrawer"); // "mainSideDrawer"는 SideDrawer에 지정한 고유 ID입니다.
    };

    return (
        <>
            <Header >
                <p>홈</p>
                <IconButton aria-label="global side drawer" onClick={handleOpenSideDrawer} // 수정: handleOpenSideDrawer 함수 호출
                    sx={{
                        color: '#000',
                        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                            color: '#000',
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Header>
            <h1>Home</h1>
            <p>헬로 리액트</p>
        </>
    );
}