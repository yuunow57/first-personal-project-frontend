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
  const [quantity, setQuantity] = useState(1); // ✅ 수량 상태 추가

  // ✅ 24시간 캔들 데이터 가져오기
  useEffect(() => {
    if (!open || !market) return;

    const fetchChart = async () => {
      try {
        const { data } = await api.get(
          `https://api.upbit.com/v1/candles/minutes/60?market=${market}&count=24`
        );
        console.log("📊 업비트 응답 데이터:", data);
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ 차트 데이터 없음:", data);
          setChartData([]);
          return;
        }

        // ✅ 차트 표시용 데이터 변환
        const formatted = [...data].reverse().map((d) => ({
          time: new Date(d.timestamp).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: d.trade_price,
        }));

        setChartData(formatted);
        setCurrent(data[0]);
      } catch (e) {
        console.error("❌ 차트 데이터 로드 실패:", e);
        setChartData([]);
      }
    };

    fetchChart();
  }, [open, market]);

  if (!open) return null;

  const price = current?.trade_price ?? 0;
  const rate = ((current?.signed_change_rate ?? 0) * 100).toFixed(2);
  const total = price * quantity; // ✅ 총 거래 금액 계산

  const handleBuy = () => {
    alert(
      `✅ ${market} 매수 주문\n수량: ${quantity}개\n현재가: ${price.toLocaleString()}원\n총 금액: ${total.toLocaleString()}원`
    );
  };

  const handleSell = () => {
    alert(
      `✅ ${market} 매도 주문\n수량: ${quantity}개\n현재가: ${price.toLocaleString()}원\n총 금액: ${total.toLocaleString()}원`
    );
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

        {/* 현재가 및 등락률 */}
        <div className="flex gap-6 mb-4">
          <div>
            <div className="text-gray-400 text-sm">현재가</div>
            <div className="text-lg font-semibold">
              {price.toLocaleString()} 원
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">등락률</div>
            <div
              className={`text-lg font-semibold ${
                rate > 0 ? "text-red-400" : "text-blue-400"
              }`}
            >
              {rate}%
            </div>
          </div>
        </div>

        {/* ✅ 24시간 가격 차트 */}
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

        {/* ✅ 수량 입력 */}
        <div className="flex justify-center mb-3">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 text-center bg-gray-800 border border-gray-600 rounded p-2"
          />
          <span className="ml-2 mt-2 text-gray-400 text-sm">개</span>
        </div>

        {/* ✅ 총 금액 표시 */}
        <div className="text-center text-gray-300 text-sm mb-5">
          총 금액: <span className="text-yellow-400 font-semibold">{total.toLocaleString()}</span> 원
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
