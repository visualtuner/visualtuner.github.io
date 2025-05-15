import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Components() {
    const navigate = useNavigate();
    
    return (
        <>
            <Header>
                <p>컴포넌트</p>
            </Header>
            <h1>Components</h1>
			<p>컴포넌트 디자인 나열</p>
            <Stack direction="row" spacing={2} sx={{ px: 2 }}>
                <Button className="MuiButton--circle" variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Go to Buttons
                </Button>

                <Button className="MuiButton--circle" variant="outlined" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Go to Buttons
                </Button>
            </Stack>
        </>
    );
}