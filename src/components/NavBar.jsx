import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [exp, setExp] = useState(localStorage.getItem("tokenExp"));

  // 토큰 만료 체크
  useEffect(() => {
    if (exp && Date.now() > Number(exp)) {
      console.warn("⚠️ 토큰 만료 — 자동 로그아웃");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExp");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  }, [exp]);

  // 수동 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExp");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#17171C] text-white shadow-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-1 py-3 flex justify-between items-center">
        {/* 로고 */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-green-400 cursor-pointer hover:text-green-300 transition"
        >
          CoinView
        </div>

        {/* 중앙 메뉴 */}
        <div className="flex gap-10 text-gray-300">
          <button onClick={() => navigate("/")} className="hover:text-white transition">대시보드</button>
          <button onClick={() => navigate("/portfolio")} className="hover:text-white transition">내 자산</button>
          <button onClick={() => navigate("/history")} className="hover:text-white transition">거래 내역</button>
        </div>

        {/* 오른쪽 유저 정보 */}
        <div className="flex items-center gap-5">
          {token && user ? (
            <>
              <span className="text-sm text-gray-400">
                안녕하세요,{" "}
                <span className="text-green-400 font-semibold">{user.username}</span>님
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
