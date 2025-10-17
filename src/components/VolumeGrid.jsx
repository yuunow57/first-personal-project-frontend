import { useEffect, useState } from "react";
import api from "../services/api";

function VolumeGrid({ onSelect }) {
  const [volumes, setVolumes] = useState([]);

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 token =", token);
        const res = await api.get("/trades");
        console.log("📦 /trades response =", res.status, res.data);

        const trades = res.data?.trades ?? [];
        if (!Array.isArray(trades)) {
          console.warn("⚠️ trades가 배열이 아닙니다:", trades);
          setVolumes([]);
          return;
        }

        const counts = {};
        trades.forEach((t) => {
          const key = t.coinName ?? "UNKNOWN";
          counts[key] = (counts[key] || 0) + 1;
        });

        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([coinName, count]) => ({ coinName, count }));

        setVolumes(sorted);
      } catch (error) {
        const status = error?.response?.status;
        console.error("❌ /trades 실패:", status, error?.response?.data || error.message);
        setVolumes([]);
      }
    };

    fetchVolumes();
  }, []);

  return (
    <div className="mt-6 bg-[#17171C] text-white p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">거래량 상위 15종목</h2>
      <div className="grid grid-cols-3 gap-4">
        {volumes.length === 0 ? (
          <div className="col-span-3 text-gray-400 text-center py-4">
            거래 데이터가 없습니다 😢
          </div>
        ) : (
          volumes.map((v, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(v.coinName)}
              className="cursor-pointer hover:bg-gray-800 p-3 rounded transition-all"
            >
              <div className="text-lg font-medium">{v.coinName}</div>
              <div className="text-sm text-gray-400">
                거래 횟수: {v.count.toLocaleString()}회
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VolumeGrid;
