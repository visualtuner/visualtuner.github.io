import { Link } from "react-router-dom";

export default function NavBar() {
	return (
        <div className="nav-bar">
            <nav>
                <Link to="/">홈</Link> | <Link to="/Components">컴포넌트</Link>
            </nav>
        </div>
	);
}
