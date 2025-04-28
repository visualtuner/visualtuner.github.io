import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";

export default function Home() {
    const navigate = useNavigate();

	return (
		<>
			<Header >
                <p>홈</p>
            </Header>
			<h1>Home</h1>
			<p>헬로 리액트</p>
		</>
	);
}
