import Header from "../components/Header";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDrawer } from "../contexts/DrawerContext";

export default function Home() {
    // 이제 useDrawer 훅에서 openDrawer 함수를 가져옵니다.
    const { openDrawer } = useDrawer();

    // 사이드 드로어를 여는 올바른 함수
    const handleOpenSideDrawer = () => {
        openDrawer("mainSideDrawer"); // SideDrawer에 부여한 고유 ID를 전달합니다.
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
        </>
    );
}