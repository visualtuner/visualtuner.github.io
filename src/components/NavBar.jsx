import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();
    
	return (
        <nav className="nav-bar">
            <button onClick={() => navigate('/')}>홈</button>
            <button onClick={() => navigate('/components')}>컴포넌트</button>
        </nav>
	);
}
