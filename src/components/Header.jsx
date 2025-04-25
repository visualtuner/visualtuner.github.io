import { Link } from "react-router-dom";

export default function Header({title}) {
	return (
        <header className="app-bar">
            <p>{title}</p>
        </header>
	);
}
