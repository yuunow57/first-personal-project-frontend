import { useEffect, useState } from "react";
import api from "../services/api";

function VolumeGrid({ onSelect }) {
  const [buyVolumes, setBuyVolumes] = useState([]);   // ✅ 매수 상위 15
  const [sellVolumes, setSellVolumes] = useState([]); // ✅ 매도 상위 15
  const [marketNames, setMarketNames] = useState({}); // ✅ 한글 이름 매핑

  // ✅ Upbit 로고 URL 생성 함수
  const getLogoUrl = (market) => {
    try {
      const symbol = market.split("-")[1];
      return `https://static.upbit.com/logos/${symbol}.png`;
    } catch {
      return "";
    }
  };

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

  // ✅ 공통 렌더링 함수
  const renderCoinBox = (v, idx, color) => {
    const name = marketNames[v.coinName] || v.coinName;
    const logoUrl = getLogoUrl(v.coinName);
    return (
      <div
        key={idx}
        onClick={() => onSelect(v.coinName)}
        className={`cursor-pointer bg-[#1c1d23] hover:bg-[#2a2b31] p-3 rounded-lg flex items-center gap-3 transition-all border border-transparent hover:border-${color}-500/50`}
      >
        <img
          src={logoUrl}
          alt={name}
          className="w-7 h-7 rounded-full"
          onError={(e) => (e.target.style.display = "none")}
        />
        <div className="flex flex-col">
          <span className="font-medium text-white">{name}</span>
          <span className="text-xs text-gray-400">
            거래 횟수: {v.count.toLocaleString()}회
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 bg-[#17171C] text-white p-6 rounded-xl shadow-lg space-y-8">
      {/* ✅ 매수 상위 15 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-green-400">
          📈 매수 상위 15종목
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {buyVolumes.length === 0 ? (
            <div className="col-span-3 text-gray-400 text-center py-4">
              매수 데이터가 없습니다 😢
            </div>
          ) : (
            buyVolumes.map((v, idx) => renderCoinBox(v, idx, "green"))
          )}
        </div>
      </section>

      {/* ✅ 구분선 */}
      <div className="border-t border-gray-700"></div>

      {/* ✅ 매도 상위 15 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-400">
          📉 매도 상위 15종목
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {sellVolumes.length === 0 ? (
            <div className="col-span-3 text-gray-400 text-center py-4">
              매도 데이터가 없습니다 😢
            </div>
          ) : (
            sellVolumes.map((v, idx) => renderCoinBox(v, idx, "red"))
          )}
        </div>
      </section>
    </div>
  );
}

export default VolumeGrid;
