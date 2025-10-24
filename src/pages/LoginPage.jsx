import { useState } from "react";
import api from "../services/api.js";
import { btnStyles } from "../styles/buttonStyle";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const expTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("tokenExp", expTime);
      setMessage("✅ 로그인 성공!");
      window.location.href = "/";
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ 로그인 실패");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          로그인
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className={`${btnStyles.login} w-full text-base py-3 font-semibold`}
          >
            로그인
          </button>
        </form>

        {message && (
          <p className="text-center text-yellow-400 mt-5 text-sm">{message}</p>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          계정이 없으신가요?{" "}
          <a
            href="/auth/register"
            className="text-emerald-400 hover:underline hover:text-emerald-300"
          >
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
