import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useScrollRestoration from "@/hooks/useScrollRestoration";
import { useTransition } from "@/contexts/TransitionContext";

export default function Profiles() {
    const location = useLocation();
    const { transitionDone } = useTransition();
    const navigate = useNavigate();
    const mainScrollContainerRef = useRef(null);
        
    useScrollRestoration(mainScrollContainerRef, undefined,  transitionDone, false, location.state?.restoreScroll);

    useEffect(() => {
        //console.log("Profiles - transitionDone?", transitionDone);
        if (transitionDone) {
            //console.log("Profiles - transitionDone? 이번엔?", transitionDone);
        }
    }, [transitionDone]);
    
    return (
        <Box ref={mainScrollContainerRef} className="layout">
            <Header >
                <IconButton aria-label="back" onClick={() => navigate(-1)}
                    sx={{
                        color: '#000',
                        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                            color: '#000',
                        },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <p>프로필</p>
            </Header>
            <h1>Profiles Page</h1>
			<p>팝 트랜지션 예시 페이지</p>

            <ol>
                <li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li>
            </ol>
        </Box>
    );
}