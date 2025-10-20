import { useEffect, useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";

export default function HistoryPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        // ✅ 로그인한 사용자 정보 가져오기
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.warn("⚠️ 로그인된 사용자가 없습니다.");
          setLoading(false);
          return;
        }

        // ✅ 해당 사용자 거래 내역 호출
        const { data } = await api.get(`/trades/${user.id}`);
        setTrades(data.trade || []);
      } catch (err) {
        console.error("❌ 거래내역 조회 실패:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // ✅ 포맷 함수들
  const formatNumber = (n) => {
    if (n == null || n === "" || isNaN(Number(n))) return "-";
    return parseFloat(n).toLocaleString("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatQuantity = (n) => {
    if (n == null || n === "" || isNaN(Number(n))) return "-";
    return parseFloat(n).toLocaleString("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  };

  const total = trades.length;
  const buyCount = trades.filter((t) => t.type === "buy").length;
  const sellCount = trades.filter((t) => t.type === "sell").length;

  return (
    <div className="min-h-screen bg-[#17171C] text-white p-6 pb-20">
      <NavBar />
      <main className="pt-20 max-w-[900px] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">거래 내역</h1>

        {/* 🔹 상단 요약 카드 */}
        <div className="bg-[#17171C] border-y border-gray-800 mb-10 grid grid-cols-3 text-center">
          <div className="p-5 border-r border-gray-800">
            <div className="text-gray-400 text-sm mb-1">총 거래 건수</div>
            <div className="text-xl font-bold text-yellow-400">{total}</div>
          </div>
          <div className="p-5 border-r border-gray-800">
            <div className="text-gray-400 text-sm mb-1">매수 건수</div>
            <div className="text-xl font-bold text-green-400">{buyCount}</div>
          </div>
          <div className="p-5">
            <div className="text-gray-400 text-sm mb-1">매도 건수</div>
            <div className="text-xl font-bold text-red-400">{sellCount}</div>
          </div>
        </div>

        {/* 🔹 거래내역 테이블 */}
        <div className="bg-[#111214] border-y border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 font-semibold text-gray-300">
            나의 거래 기록
          </div>

          {loading ? (
            <div className="p-6 text-gray-400 text-center">불러오는 중...</div>
          ) : trades.length === 0 ? (
            <div className="p-6 text-gray-400 text-center">
              아직 거래 내역이 없습니다.
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto custom-scroll">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0e0f12] border-y border-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-2">코인명</th>
                    <th className="px-4 py-2">유형</th>
                    <th className="px-4 py-2 text-right">수량</th>
                    <th className="px-4 py-2 text-right">가격</th>
                    <th className="px-4 py-2 text-right">총금액</th>
                    <th className="px-4 py-2 text-right">거래일시</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr
                      key={t.id}
                      className="border-y border-gray-900/60 hover:bg-gray-800/60 transition"
                    >
                      <td className="px-4 py-2">{t.coinName}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          t.type === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {t.type === "buy" ? "매수" : "매도"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatQuantity(t.quantity)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatNumber(t.price)} 원
                      </td>
                      <td className="px-4 py-2 text-right text-yellow-400 font-semibold">
                        {formatNumber(t.totalAmount)} 원
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        {new Date(t.createdAt).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
