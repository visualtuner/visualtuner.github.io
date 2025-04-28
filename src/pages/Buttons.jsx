import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";

export default function Buttons() {
    const navigate = useNavigate();
    
    return (
        <>
            <Header >
                <button onClick={() => navigate(-1)}>뒤로</button>
                <p>버튼</p>
            </Header>
            <h1>Buttons Page</h1>
			<p>버튼 디자인 모음</p>
        </>
    );
}