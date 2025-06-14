import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useScrollRestoration from "@/hooks/useScrollRestoration";
import { useTransition } from "@/contexts/TransitionContext";

export default function Buttons() {
    const { transitionDone } = useTransition();
    const navigate = useNavigate();
    const layoutRef = useRef(null);
        
    useScrollRestoration(layoutRef, transitionDone, true, location.state?.restoreScroll);

    useEffect(() => {
        console.log("Buttons - transitionDone?", transitionDone);
        if (transitionDone) {
            console.log("Buttons - transitionDone? 이번엔?", transitionDone);
        }
    }, [transitionDone]);
    
    return (
        <Box ref={layoutRef} className="layout">
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
                <p>버튼</p>
            </Header>
            <h1>Buttons Page</h1>
			<p>버튼 디자인 모음</p>

            <ol>
                <li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li><li>스크롤</li>
            </ol>
        </Box>
    );
}