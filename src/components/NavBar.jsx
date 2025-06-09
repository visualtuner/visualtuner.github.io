import { useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar() {
	const navigate = useNavigate();
	const location = useLocation();

	const handleNavClick = (path, state = {}) => {
        if (location.pathname !== path) {
            navigate(path, { state });
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
            >
                <HomeOutlinedIcon/>
            </Button>
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
            >
                <AppsOutlinedIcon/>
            </Button>
            <Button
                onClick={() => handleNavClick('/Profiles', { transitionClassName: 'slideup' })}
                sx={{
                    height:"100%",
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                        color: '#fff',
                    },
                }}
            >
                <AccountCircleIcon/>
            </Button>
		</nav>
	);
}
