import { useState, useMemo } from "react";

function MainTable({ coins, prices, onSelect }) {
  const [sortConfig, setSortConfig] = useState({ key: "change", direction: "desc" });

  // 정렬 기준 변경 함수
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // 같은 컬럼 클릭 시 방향 반전
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // 다른 컬럼 클릭 시 새 기준 설정
      return { key, direction: "desc" };
    });
  };

  // 정렬된 데이터 생성
  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      const aPrice = prices[a.market]?.price ?? 0;
      const bPrice = prices[b.market]?.price ?? 0;
      const aChange = prices[a.market]?.change ?? 0;
      const bChange = prices[b.market]?.change ?? 0;

      let valA = 0,
        valB = 0;
      if (sortConfig.key === "price") {
        valA = aPrice;
        valB = bPrice;
      } else if (sortConfig.key === "change") {
        valA = aChange;
        valB = bChange;
      }

      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [coins, prices, sortConfig]);

  return (
    <div className="bg-[#17171C] text-white rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-3">실시간 차트</h2>

      <div className="h-[70vh] overflow-y-auto pr-2 border-b border-gray-800 custom-scroll">
        <table className="w-full text-sm md:text-base">
          <thead className="sticky top-0 bg-[#17171C] z-10 border-b border-gray-700">
            <tr className="text-gray-400">
              <th className="py-2 px-3 text-left">종목</th>
              <th
                className="py-2 px-3 text-right cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                현재가{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="py-2 px-3 text-right cursor-pointer select-none"
                onClick={() => handleSort("change")}
              >
                등락률{" "}
                {sortConfig.key === "change" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedCoins.map((coin) => {
              const price = prices[coin.market]?.price ?? 0;
              const change = (prices[coin.market]?.change ?? 0) * 100;
              const isUp = change > 0;

              // ✅ 코인 심볼 추출 (KRW-BTC → BTC)
              const symbol = coin.market.split("-")[1];
              // ✅ Upbit CDN 로고 URL
              const logoUrl = `https://static.upbit.com/logos/${symbol}.png`;

              return (
                <tr
                  key={coin.market}
                  className="hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => onSelect(coin.market)}
                >
                  <td className="py-2 px-3 flex items-center gap-2">
                    {/* ✅ 로고 추가 */}
                    <img
                      src={logoUrl}
                      alt={symbol}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => (e.target.style.display = "none")} // 로고 없으면 숨김
                    />
                    <span>{coin.korean_name}</span>
                  </td>
                  <td className="py-2 px-3 text-right">{price.toLocaleString()}</td>
                  <td
                    className={`py-2 px-3 text-right ${
                      isUp ? "text-red-400" : "text-blue-400"
                    }`}
                  >
                    {change.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainTable;
