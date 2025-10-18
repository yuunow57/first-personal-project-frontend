import { useEffect, useState } from "react";
import api from "../services/api";

function VolumeGrid({ onSelect }) {
  const [buyVolumes, setBuyVolumes] = useState([]);   // ✅ 매수
  const [sellVolumes, setSellVolumes] = useState([]); // ✅ 매도
  const [marketNames, setMarketNames] = useState({}); // ✅ 한글 이름 매핑

  useEffect(() => {
    const fetchMarketNames = async () => {
      try {
        const { data } = await api.get("/coins");
        const map = {};
        data.coins.forEach((c) => (map[c.market] = c.korean_name));
        setMarketNames(map);
      } catch (e) {
        console.error("❌ 코인 이름 불러오기 실패:", e);
      }
    };

    const fetchVolumes = async () => {
      try {
        const res = await api.get("/trades");
        const trades = res.data?.trades ?? [];
        if (!Array.isArray(trades)) return;

        const buyCounts = {};
        const sellCounts = {};

        trades.forEach((t) => {
          const key = t.coinName ?? "UNKNOWN";
          if (t.type === "buy") buyCounts[key] = (buyCounts[key] || 0) + 1;
          if (t.type === "sell") sellCounts[key] = (sellCounts[key] || 0) + 1;
        });

        const topBuys = Object.entries(buyCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([coinName, count]) => ({ coinName, count }));

        const topSells = Object.entries(sellCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([coinName, count]) => ({ coinName, count }));

        setBuyVolumes(topBuys);
        setSellVolumes(topSells);
      } catch (error) {
        console.error("❌ /trades 실패:", error);
        setBuyVolumes([]);
        setSellVolumes([]);
      }
    };

    fetchMarketNames();
    fetchVolumes();
  }, []);

  return (
    <div className="mt-6 bg-[#17171C] text-white p-4 rounded-lg">
      {/* ✅ 상단: 매수 상위 15 */}
      <h2 className="text-xl font-semibold mb-3 text-green-400">매수 상위 15종목</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {buyVolumes.length === 0 ? (
          <div className="col-span-3 text-gray-400 text-center py-4">
            매수 데이터가 없습니다 😢
          </div>
        ) : (
          buyVolumes.map((v, idx) => (
            <div
              key={`buy-${idx}`}
              onClick={() => onSelect(v.coinName)}
              className="cursor-pointer hover:bg-gray-800 p-3 rounded transition-all"
            >
              <div className="text-lg font-medium">
                {marketNames[v.coinName] || v.coinName}
              </div>
              <div className="text-sm text-gray-400">
                매수 횟수: {v.count.toLocaleString()}회
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ 하단: 매도 상위 15 */}
      <h2 className="text-xl font-semibold mb-3 text-red-400">매도 상위 15종목</h2>
      <div className="grid grid-cols-3 gap-4">
        {sellVolumes.length === 0 ? (
          <div className="col-span-3 text-gray-400 text-center py-4">
            매도 데이터가 없습니다 😢
          </div>
        ) : (
          sellVolumes.map((v, idx) => (
            <div
              key={`sell-${idx}`}
              onClick={() => onSelect(v.coinName)}
              className="cursor-pointer hover:bg-gray-800 p-3 rounded transition-all"
            >
              <div className="text-lg font-medium">
                {marketNames[v.coinName] || v.coinName}
              </div>
              <div className="text-sm text-gray-400">
                매도 횟수: {v.count.toLocaleString()}회
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VolumeGrid;
