import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Button from '@mui/material/Button';

export default function Components() {
    const navigate = useNavigate();
    
    return (
        <>
            <Header >
                <p>컴포넌트</p>
            </Header>
            <h1>Components</h1>
			<p>컴포넌트 디자인 나열</p>
            <Button variant="contained" color="primary" onClick={() => navigate('/Components/Buttons')}>
                Go to Buttons
            </Button>
        </>
    );
}