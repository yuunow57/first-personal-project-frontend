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

  const [sortKey, setSortKey] = useState("value");
  const [sortOrder, setSortOrder] = useState("desc");

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

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedCoins = [...summary.coins].sort((a, b) => {
    if (sortKey === "market") {
      return sortOrder === "asc"
        ? a.market.localeCompare(b.market)
        : b.market.localeCompare(a.market);
    } else {
      return sortOrder === "asc"
        ? a[sortKey] - b[sortKey]
        : b[sortKey] - a[sortKey];
    }
  });

  return (
    <div className="min-h-screen bg-[#17171C] text-white p-6 pb-20">
      <NavBar />
      <main className="pt-20 max-w-[1000px] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">내 자산 현황</h1>

        {/* 🔹 상단 요약 카드 */}
        <div className="bg-[#17171C] border-y border-gray-800 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* 왼쪽: 총 자산 */}
            <div className="flex flex-col justify-center p-6">
              <div className="text-gray-400 text-sm mb-2">총 자산</div>
              <div className="text-3xl font-bold text-yellow-400">
                {number(summary.totalAsset)} 원
              </div>
            </div>

            {/* 오른쪽: 보유 잔액 / 코인 평가액 */}
            <div className="flex flex-col divide-y divide-gray-800 border-l border-gray-800">
              <div className="p-6">
                <div className="text-gray-400 text-sm mb-1">보유 잔액</div>
                <div className="text-lg font-semibold">
                  {number(summary.balance)} 원
                </div>
              </div>
              <div className="p-6">
                <div className="text-gray-400 text-sm mb-1">
                  보유 코인 평가액
                </div>
                <div className="text-lg font-semibold">
                  {number(summary.totalCoinValue)} 원
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 보유 코인 테이블 */}
        <div className="bg-[#111214] border-y border-gray-800 overflow-hidden max-w-[1000px] mx-auto">
          <div className="px-4 py-3 border-b border-gray-800 font-semibold text-gray-300">
            보유 코인
          </div>

          {loading ? (
            <div className="p-6 text-gray-400 text-center">불러오는 중...</div>
          ) : summary.coins.length === 0 ? (
            <div className="p-6 text-gray-400 text-center">
              보유 중인 코인이 없습니다.
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto custom-scroll">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-[#0e0f12] border-y border-gray-800 text-gray-400">
                    <th
                      onClick={() => handleSort("market")}
                      className="px-4 py-2 cursor-pointer select-none"
                    >
                      마켓
                    </th>
                    <th
                      onClick={() => handleSort("quantity")}
                      className="px-4 py-2 text-right cursor-pointer select-none"
                    >
                      보유수량
                    </th>
                    <th
                      onClick={() => handleSort("price")}
                      className="px-4 py-2 text-right cursor-pointer select-none"
                    >
                      현재가
                    </th>
                    <th
                      onClick={() => handleSort("value")}
                      className="px-4 py-2 text-right cursor-pointer select-none"
                    >
                      평가금액
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCoins.map((c) => (
                    <tr
                      key={c.market}
                      className="border-y border-gray-900/60 hover:bg-gray-800/70 transition"
                    >
                      <td className="px-4 py-2">{c.market}</td>
                      <td className="px-4 py-2 text-right">
                        {parseFloat(c.quantity.toFixed(4))}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {number(c.price)} 원
                      </td>
                      <td className="px-4 py-2 text-right text-yellow-400 font-semibold">
                        {number(c.value)} 원
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
