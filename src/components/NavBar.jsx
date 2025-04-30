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
            <Button sx={{height:"100%", borderRadius: 0}} onClick={() => handleNavClick('/')}>홈</Button>
            <Button sx={{height:"100%", borderRadius: 0}} onClick={() => handleNavClick('/Components')}>컴포넌트</Button>
		</nav>
	);
}
