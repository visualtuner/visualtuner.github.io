import { useNavigate } from 'react-router-dom';

export default function Header({children}) {
    const navigate = useNavigate();

	return (
        <header className="app-bar">
            {/* <button onClick={() => navigate(-1)}>뒤로</button>
            <p>{title}</p> */}
            {children}
        </header>
	);
}
