import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Profiles() {
    const navigate = useNavigate();
    
    return (
        <Box className="layout">
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
        </Box>
    );
}