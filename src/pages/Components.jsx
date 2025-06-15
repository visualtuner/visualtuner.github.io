import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useOverlay } from "@/contexts/OverlayContext";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SideDrawer from "@/components/SideDrawer"; // SideDrawer 컴포넌트를 임포트합니다.
import useScrollRestoration from "@/hooks/useScrollRestoration";
import { useTransition } from "@/contexts/TransitionContext";

export default function Components() {
    const location = useLocation();
    const { transitionDone } = useTransition();
    const navigate = useNavigate();
    const layoutRef = useRef(null);
        
    useScrollRestoration(layoutRef, transitionDone, true, location.state?.restoreScroll);

    // 이제 useDrawer 훅에서 openDrawer 함수를 가져옵니다.
    const { openOverlay } = useOverlay();

    useEffect(() => {
        //console.log("Components - transitionDone?", transitionDone);
        if (transitionDone) {
            //console.log("Components - transitionDone? 이번엔?", transitionDone);
        }
    }, [transitionDone]);
    
    const handleOpenSideDrawer = () => {
        openOverlay("drawer", "mainSideDrawer", SideDrawer, { someCustomProp: "value" });
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
                <p>컴포넌트</p>
                
            </Header>
            <h1>Components</h1>
			<p>컴포넌트 디자인 나열</p>
            <Stack spacing={1} sx={{ px: 2, mt: 3 }}>
                <TextField
                    placeholder="입력하세요"
                    variant="outlined"
                    size="small"
                />
                <TextField
                    placeholder="입력하세요"
                    variant="outlined"
                    size="medium"
                />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ px: 2, mt: 3 }}>
                <Button size="small" variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>

                <Button size="small" variant="outlined" color="primary" endIcon={<ChevronRightIcon />} onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ px: 2, mt: 1 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    홈으로로
                </Button>

                <Button variant="outlined" color="primary" endIcon={<ChevronRightIcon />} onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ px: 2, mt: 1 }}>
                <Button size="large" variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>

                <Button size="large" variant="outlined" color="primary" endIcon={<ChevronRightIcon />} onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ px: 2, mt: 2 }}>
                <Button className="MuiButton--circle" size="small" variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>

                <Button className="MuiButton--circle" size="small" variant="outlined" color="primary" endIcon={<ChevronRightIcon />} onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ px: 2, mt: 1 }}>
                <Button className="MuiButton--circle" variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>

                <Button className="MuiButton--circle" variant="outlined" color="primary" endIcon={<ChevronRightIcon />} onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ px: 2, mt: 1 }}>
                <Button className="MuiButton--circle" size="large" variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>

                <Button className="MuiButton--circle" size="large" variant="outlined" color="primary" endIcon={<ChevronRightIcon />} onClick={() => navigate('/Components/Buttons')}>
                    Buttons
                </Button>
            </Stack>

            <ol>
                <li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li>
            </ol>
        </Box>
    );
}