import Header from "../components/Header";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDrawer } from "../contexts/DrawerContext";

export default function Home() {
    const { setDrawerOpen } = useDrawer();

	return (
		<>
			<Header >
                <p>홈</p>
                <IconButton aria-label="global side drawer" onClick={() => setDrawerOpen("side", true)}
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
