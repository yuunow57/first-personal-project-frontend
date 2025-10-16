import { useState } from "react";
import api from "../services/api.js";

function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post("/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);
            setMessage("✅ 로그인 성공!");

            window.location.href = "/dashboard"; // 새로고침을 해야하기 때문에 navigate 사용 X
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ 로그인 실패");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">로그인</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-1">이메일</label>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-1">비밀번호</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
                    >
                        로그인
                    </button>
                </form>

                {message && (
                <p className="text-center text-yellow-400 mt-4">{message}</p>
                )}
            </div>
        </div>
    );
}

export default LoginPage;