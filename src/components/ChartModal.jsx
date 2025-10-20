import { useEffect, useState } from "react";
import api from "../services/api";
import { btnStyles } from "../styles/buttonStyle";
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
  const [owned, setOwned] = useState(0); // ✅ 보유 수량
  const [balance, setBalance] = useState(0); // ✅ 보유 잔액

  // ✅ 모달 열릴 때마다 수량 1로 리셋
  useEffect(() => {
    if (open) setQuantity(1);
  }, [open]);

  useEffect(() => {
    if (!open || !market) return;

    const fetchChart = async () => {
      try {
        const { data } = await api.get(`/candles/${market}`);
        const candles = data.candles;

        if (!Array.isArray(candles) || candles.length === 0) {
          setChartData([]);
          return;
        }

        const formatted = candles
          .map((d) => ({
            time: new Date(d.time).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            price: d.price,
          }))
          .reverse();

        setChartData(formatted);
        setCurrent(formatted[formatted.length - 1]);
      } catch (e) {
        console.error("❌ 차트 데이터 로드 실패:", e);
        setChartData([]);
      }
    };

    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/me");
        setBalance(data.balance);
        const coin = data.coins?.find((c) => c.market === market);
        setOwned(coin ? coin.quantity : 0);
      } catch (e) {
        console.error("❌ 사용자 자산 로드 실패:", e);
      }
    };

    fetchChart();
    fetchUserData();
  }, [open, market]);

  if (!open) return null;

  const price = current?.price ?? 0;
  const total = price * quantity;

  // ✅ 매수
  const handleBuy = async () => {
    try {
      await api.post("/trades", {
        type: "buy",
        coinName: market,
        price: current.price,
        quantity,
      });
      alert(
        `✅ ${market} 매수 완료\n수량: ${quantity}개\n현재가: ${price.toLocaleString()}원\n총 금액: ${total.toLocaleString()}원`
      );
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || "❌ 매수 중 오류가 발생했습니다.";
      alert(msg);
      console.error("❌ 매수 요청 실패:", error);
    }
  };

  // ✅ 매도
  const handleSell = async () => {
    try {
      await api.post("/trades", {
        type: "sell",
        coinName: market,
        price: current.price,
        quantity,
      });
      alert(
        `✅ ${market} 매도 완료\n수량: ${quantity}개\n현재가: ${price.toLocaleString()}원\n총 금액: ${total.toLocaleString()}원`
      );
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || "❌ 매도 중 오류가 발생했습니다.";
      alert(msg);
      console.error("❌ 매도 요청 실패:", error);
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
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#aaa", fontSize: 10 }} />
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

        {/* 하단 정보 & 입력 */}
        <div className="flex justify-between items-center">
          {/* 왼쪽: 사용자 자산 정보 */}
          <div className="text-sm text-gray-300 leading-relaxed">
            <p>보유 수량: <span className="text-green-400 font-medium">{owned}</span> 개</p>
            <p>보유 평가액: <span className="text-yellow-400 font-medium">{(owned * price).toLocaleString()}</span> 원</p>
            <p>매수 가능 잔액: <span className="text-blue-400 font-medium">{balance.toLocaleString()}</span> 원</p>
          </div>

          {/* 오른쪽: 수량 입력 + 버튼 */}
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              step="0.0001"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-32 text-center bg-gray-800 border border-gray-600 rounded p-2 text-white appearance-none"
            />
            <span className="text-gray-400 text-sm">개</span>

            <button
              onClick={handleBuy}
              className={btnStyles.buy}
            >
              매수
            </button>
            <button
              onClick={handleSell}
              className={btnStyles.sell}
            >
              매도
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartModal;
