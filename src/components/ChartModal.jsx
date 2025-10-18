import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartModal({ market, open, onClose }) {
  const [chartData, setChartData] = useState([]);
  const [current, setCurrent] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open || !market) return;

    const fetchChart = async () => {
      try {
        const { data } = await api.get(`/candles/${market}`);

        const candles = data.candles

        if (!Array.isArray(candles) || candles.length === 0) {
          console.warn("차트 데이터 없음:", candles);
          setChartData([]);
          return;
        }

        // ✅ 시간 포맷을 보기 좋게 변환 (한국 시간)
        const formatted = candles
          .map((d) => ({
            time: new Date(d.time).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            price: d.price,
          }))
          .reverse(); // 오래된 -> 최신 순으로 정렬

        setChartData(formatted);
        setCurrent(formatted[formatted.length - 1]); // 최신 데이터(가장 최근 시세)
      } catch (e) {
        console.error("❌ 차트 데이터 로드 실패:", e);
        setChartData([]);
      }
    };

    fetchChart();
  }, [open, market]);

  if (!open) return null;

  const price = current?.price ?? 0;
  const total = price * quantity;

  const handleBuy = async () => {
    try {
      await api.post("/trades", {
        type: "buy",
        coinName: market,
        price: current.price,
        quantity,
      });
      alert(
        `✅ ${market} 매수 주문\n수량: ${quantity}개\n현재가: ${price.toLocaleString()}원\n총 금액: ${total.toLocaleString()}원`
      );
    } catch (error) {
      console.error("❌매수 요청 실패:", error);
    }
  };

  const handleSell = async () => {
    try {
      await api.post("/trades", {
        type: "sell",
        coinName: market,
        price: current.price,
        quantity,
      });
    alert(
      `✅ ${market} 매도 주문\n수량: ${quantity}개\n현재가: ${price.toLocaleString()}원\n총 금액: ${total.toLocaleString()}원`
    );
    } catch (error) {
      console.error("❌매도 요청 실패:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[800px] max-w-[95vw] rounded-2xl p-6 shadow-xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{market} 시세 (24시간)</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            닫기 ✖
          </button>
        </div>

        {/* 현재가 */}
        <div className="flex gap-6 mb-4">
          <div>
            <div className="text-gray-400 text-sm">현재가</div>
            <div className="text-lg font-semibold">
              {price.toLocaleString()} 원
            </div>
          </div>
        </div>

        {/* ✅ 차트 */}
        <div className="bg-gray-800 rounded-xl h-64 mb-5 p-3">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" tick={{ fill: "#aaa", fontSize: 10 }} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "#aaa", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ background: "#333", border: "none" }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              차트 데이터를 불러오는 중입니다...
            </div>
          )}
        </div>

        {/* 수량 입력 */}
        <div className="flex justify-center mb-3">
          <input
              type="number"
              min="0"
              step="0.0001"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                // 빈값 입력 시 NaN 방지
                setQuantity(val === "" ? "" : Number(val));
              }}
              className="w-32 text-center bg-gray-800 border border-gray-600 rounded p-2 text-white"
            />
            <span className="ml-2 mt-2 text-gray-400 text-sm">개</span>
        </div>

        {/* 총 금액 */}
        <div className="text-center text-gray-300 text-sm mb-5">
          총 금액:{" "}
          <span className="text-yellow-400 font-semibold">
            {total.toLocaleString()}
          </span>{" "}
          원
        </div>

        {/* 매수/매도 버튼 */}
        <div className="flex justify-center gap-6">
          <button
            onClick={handleBuy}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium"
          >
            매수
          </button>
          <button
            onClick={handleSell}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium"
          >
            매도
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChartModal;
