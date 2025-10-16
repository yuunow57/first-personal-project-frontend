// src/components/VolumeGrid.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

function VolumeGrid({ coins, onSelect }) {
  const [volumes, setVolumes] = useState([]);

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        // ✅ 거래 횟수 기준 볼륨 데이터 호출
        const { data } = await api.get("/trades"); // 모든 거래 내역
        const counts = {};

        // 각 코인별 거래 횟수 계산
        data.forEach((trade) => {
          counts[trade.coinName] = (counts[trade.coinName] || 0) + 1;
        });

        // 거래 횟수 상위 15개만 추출
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([coinName, count]) => ({ coinName, count }));

        setVolumes(sorted);
      } catch (error) {
        console.error("거래량 데이터를 불러오지 못했습니다.", error);
      }
    };

    fetchVolumes();
  }, []);

  return (
    <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">거래량 상위 15종목</h2>
      <div className="grid grid-cols-3 gap-4">
        {volumes.map((v, idx) => (
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
        ))}
      </div>
    </div>
  );
}

export default VolumeGrid;
