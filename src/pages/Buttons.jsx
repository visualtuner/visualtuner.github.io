import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useScrollRestoration from "@/hooks/useScrollRestoration";

export default function Buttons({ transitionDone }) {
    const navigate = useNavigate();
    const layoutRef = useRef(null);
        
    useScrollRestoration(layoutRef, transitionDone);
    
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