import { useNavigate } from 'react-router-dom';

export default function Header({title}) {
    const navigate = useNavigate();
    
	return (
        <header className="app-bar">
            <button onClick={() => navigate(-1)}>뒤로</button>
            <p>{title}</p>
        </header>
	);
}
