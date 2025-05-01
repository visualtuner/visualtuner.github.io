import { useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';

export default function NavBar() {
	const navigate = useNavigate();
	const location = useLocation();

	const handleNavClick = (path) => {
		if (location.pathname !== path) {
			navigate(path);
		}
	};

	return (
		<nav className="nav-bar">
            <Button
                onClick={() => handleNavClick('/')}
                sx={{
                    height:"100%",
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                        color: '#fff',
                    },
                }}
            >홈</Button>
            <Button
                onClick={() => handleNavClick('/Components')}
                sx={{
                    height:"100%",
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                        color: '#fff',
                    },
                }}
            >컴포넌트</Button>
		</nav>
	);
}
