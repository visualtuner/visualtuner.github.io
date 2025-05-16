import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Components() {
    const navigate = useNavigate();
    
    return (
        <>
            <Header>
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
                <Button variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                    Buttons
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
        </>
    );
}