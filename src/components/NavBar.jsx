import { Link } from "react-router-dom";

export default function NavBar() {
	return (
        <nav className="nav-bar">
            <Link to="/">홈</Link>
            <Link to="/Components">컴포넌트</Link>
        </nav>
	);
}
