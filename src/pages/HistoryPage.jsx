import { useEffect, useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";

export default function HistoryPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data } = await api.get("/trades");
        setTrades(data.trades || []);
      } catch (err) {
        console.error("❌ 거래내역 조회 실패:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  const number = (n) => n?.toLocaleString("ko-KR") ?? n;

  return (
    <div className="min-h-screen bg-[#17171C] text-white">
      <NavBar />
      {/* ✅ 아래 여백 추가 (pb-20) */}
      <main className="pt-20 max-w-7xl mx-auto px-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">거래 내역</h1>

        <div className="bg-[#111214] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 font-semibold">
            나의 거래 기록
          </div>

          {loading ? (
            <div className="p-6 text-gray-400">불러오는 중...</div>
          ) : trades.length === 0 ? (
            <div className="p-6 text-gray-400">아직 거래 내역이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0e0f12] border-b border-gray-800 text-left">
                  <th className="px-4 py-2">코인명</th>
                  <th className="px-4 py-2">유형</th>
                  <th className="px-4 py-2 text-right">수량</th>
                  <th className="px-4 py-2 text-right">가격</th>
                  <th className="px-4 py-2 text-right">총금액</th>
                  <th className="px-4 py-2 text-right">거래일시</th>
                </tr>
              </thead>
              <tbody>
                {trades
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((t) => (
                    <tr key={t.id} className="border-b border-gray-900/50">
                      <td className="px-4 py-2">{t.coinName}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          t.type === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {t.type === "buy" ? "매수" : "매도"}
                      </td>
                      <td className="px-4 py-2 text-right">{t.quantity}</td>
                      <td className="px-4 py-2 text-right">{number(t.price)} 원</td>
                      <td className="px-4 py-2 text-right">{number(t.totalAmount)} 원</td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        {new Date(t.createdAt).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
