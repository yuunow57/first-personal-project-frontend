import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#17171C] text-white shadow-md border-b border-gray-800">
      {/* ✅ 중앙 정렬 & 여백 강화 */}
      <div className="max-w-7xl mx-auto px-1 py-3 flex justify-between items-center">

        {/* 왼쪽 로고 */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-green-400 cursor-pointer hover:text-green-300 transition"
        >
          CoinView
        </div>

        {/* 중앙 메뉴 */}
        <div className="flex gap-10 text-gray-300">
          <button
            onClick={() => navigate("/")}
            className="hover:text-white transition"
          >
            대시보드
          </button>
          <button
            onClick={() => navigate("/portfolio")}
            className="hover:text-white transition"
          >
            내 자산
          </button>
          <button
            onClick={() => navigate("/history")}
            className="hover:text-white transition"
          >
            거래 내역
          </button>
        </div>

        {/* 오른쪽 유저 정보 */}
        <div className="flex items-center gap-5">
          {user ? (
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
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
