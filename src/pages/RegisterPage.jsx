import React, { useState } from "react"; // useState는 입력된 값을 실시간으로 저장 (이름, 이메일, 비밀번호)
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
    const [username, setUsername] = useState(""); // useState("")는 리액트가 내부에 저장하고있는 스토리지의 [0]에 ""라는 값을 저장한 후 username에 할당하고
    const [email, setEmail] = useState("");       // setState()라는 함수를 setUsername에 할당한다. 그리고 입력값이 들어오면 setUsername함수의 내부 기능으로
    const [password, setPassword] = useState(""); // 입력값을 스토리지[0]에 저장한후 컴포넌트를 리로딩하여 useState()가 다시 스토리지의[0] 값을 username에
                                                  // 할당하는 식으로 username을 변경
    const navigate = useNavigate(); // navigate(url)로 실제 url주소를 변경

    // ✅회원가입 요청 함수
    const handleRegister = async (e) => {
        e.preventDefault(); // 폼이 Submit 될때 페이지 전체가 새로고침 되는걸 방지, preventDefault는 이벤트가 가지고있는 기본동작을 막아줌 
                            // ex <form> submit = 페이지 새로고침
        try {
            // 백엔드로 회원가입 요청 (POST)
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                username,
                email,
                password,
            });

            alert(response.data.message); // "✅ 회원가입 완료"
            navigate("/"); // 로그인 페이지로 이동
        } catch (error) {
            // 백엔드에서 온 에러메시지 표시
            alert(error.response?.data?.message || "회원가입 실패");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">회원가입</h2>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="사용자 이름"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 rounded bg-gray-700 focus:outline-none"
                    />
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded bg-gray-700 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 rounded bg-gray-700 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
                    >
                        회원가입
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-400">
                    이미 계정이 있으신가요?{" "}
                    <span
                        className="text-yellow-400 cursor-pointer hover:underline"
                        onClick={() => navigate("/")}
                    >
                        로그인
                    </span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;