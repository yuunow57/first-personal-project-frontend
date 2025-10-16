// src/components/ChartModal.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

function ChartModal({ market, open, onClose }) {
  const [tick, setTick] = useState(null);

  useEffect(() => {
    if (!open || !market) return;

    let timer;
    const fetchNow = async () => {
      try {
        const { data } = await api.get(`/price/${market}`);
        setTick({
            trade_price: data.price,
            signed_change_rate: data.change,
        });
      } catch (e) {
        // 실패해도 조용히 무시 (UI만)
      }
    };

    fetchNow();
    timer = setInterval(fetchNow, 3000); // 3초마다 갱신
    return () => clearInterval(timer);
  }, [open, market]);

  if (!open) return null;

  const price = tick?.trade_price ?? 0;
  const rate = (tick?.signed_change_rate ?? 0) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[720px] max-w-[95vw] rounded-2xl p-5 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{market} 시세</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-300 hover:text-white"
          >
            닫기
          </button>
        </div>

        {/* 여기 나중에 진짜 차트 붙일 자리 */}
        <div className="bg-gray-800 rounded-xl h-60 mb-4 flex items-center justify-center">
          <span className="text-gray-400 text-sm">
            (그래프 영역 – Recharts 연동 예정)
          </span>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-gray-400">현재가</div>
            <div className="text-base font-semibold">
              {Number(price).toLocaleString()} 원
            </div>
          </div>
          <div>
            <div className="text-gray-400">등락률</div>
            <div className={rate > 0 ? "text-red-400" : "text-blue-400"}>
              {rate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartModal;
