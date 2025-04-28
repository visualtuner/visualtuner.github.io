import { useNavigate, useLocation } from "react-router-dom";

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
			<button onClick={() => handleNavClick('/')}>홈</button>
			<button onClick={() => handleNavClick('/Components')}>컴포넌트</button>
		</nav>
	);
}
