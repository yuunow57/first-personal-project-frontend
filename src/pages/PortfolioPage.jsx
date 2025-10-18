import { useEffect, useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";

function number(n) {
  return n?.toLocaleString?.("ko-KR") ?? n;
}

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    balance: 0,
    totalCoinValue: 0,
    totalAsset: 0,
    coins: [],
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/me");
        setSummary({
          balance: data.balance,
          totalCoinValue: data.totalCoinValue,
          totalAsset: data.totalAsset,
          coins: data.coins || [],
        });
      } catch (e) {
        console.error("❌ /me 조회 실패:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  return (
    <div className="min-h-screen bg-[#17171C] text-white p-6 pb-20">
      <NavBar />
      <main className="pt-20 max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">내 자산 현황</h1>

        {/* 상단 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111214] border border-gray-800 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">보유 잔액</div>
            <div className="text-xl font-semibold">{number(summary.balance)} 원</div>
          </div>
          <div className="bg-[#111214] border border-gray-800 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">보유 코인 평가액</div>
            <div className="text-xl font-semibold">{number(summary.totalCoinValue)} 원</div>
          </div>
          <div className="bg-[#111214] border border-gray-800 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">총 자산</div>
            <div className="text-xl font-semibold">{number(summary.totalAsset)} 원</div>
          </div>
        </div>

        {/* 보유 코인 테이블 */}
        <div className="bg-[#111214] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 font-semibold">보유 코인</div>
          {loading ? (
            <div className="p-6 text-gray-400">불러오는 중...</div>
          ) : summary.coins.length === 0 ? (
            <div className="p-6 text-gray-400">보유 중인 코인이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-[#0e0f12] border-b border-gray-800">
                  <th className="px-4 py-2">마켓</th>
                  <th className="px-4 py-2 text-right">보유수량</th>
                  <th className="px-4 py-2 text-right">현재가</th>
                  <th className="px-4 py-2 text-right">평가금액</th>
                </tr>
              </thead>
              <tbody>
                {summary.coins.map((c) => (
                  <tr key={c.market} className="border-b border-gray-900/50">
                    <td className="px-4 py-2">{c.market}</td>
                    <td className="px-4 py-2 text-right">{c.quantity}</td>
                    <td className="px-4 py-2 text-right">{number(c.price)} 원</td>
                    <td className="px-4 py-2 text-right">{number(c.value)} 원</td>
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
