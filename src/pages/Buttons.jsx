import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Buttons() {
    const navigate = useNavigate();
    
    return (
        <>
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
        </>
    );
}