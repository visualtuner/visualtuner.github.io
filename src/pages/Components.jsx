import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Components() {
	const navigate = useNavigate();

	return (
		<>
			<Header title="Components" />
			<h1>Components</h1>
			<p>컴포넌트 디자인 나열</p>
			<button onClick={() => navigate('/Components/Buttons')}>Go to Buttons</button>
		</>
	);
}