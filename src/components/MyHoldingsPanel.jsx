import { useEffect, useState } from "react";
import api from "../services/api";

function MyHoldingsPanel({ onSelect }) {
  const [coins, setCoins] = useState([]);
  const [marketNames, setMarketNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 로그인된 사용자의 보유 코인 목록
        const { data } = await api.get("/me");
        setCoins(data.coins || []);

        // 🔹 한글 이름 매핑용 전체 코인 목록
        const res = await api.get("/coins");
        const map = {};
        res.data.coins.forEach((c) => (map[c.market] = c.korean_name));
        setMarketNames(map);
      } catch (e) {
        console.error("❌ 보유 종목 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 수량 표시 형식 함수
  const formatQuantity = (q) => {
    if (!q) return "0";
    const num = Number(q);
    if (Number.isInteger(num)) return num.toString(); // 정수면 그대로
    return num.toFixed(4).replace(/\.?0+$/, ""); // 소수점 4자리, 뒤 0 제거
  };

  return (
    <div className="mt-2 bg-[#17171C] text-white p-3 rounded-lg mb-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-200">
        💰 내 보유 종목
      </h2>

      {loading ? (
        <div className="text-gray-400 text-sm text-center py-3">
          불러오는 중...
        </div>
      ) : coins.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-3">
          보유 중인 코인이 없습니다 😢
        </div>
      ) : (
        <div className="max-h-[260px] overflow-y-auto custom-scroll">
          {coins.map((coin) => {
            const symbol = coin.market.split("-")[1];

            return (
              <div
                key={coin.market}
                onClick={() => onSelect(coin.market)}
                className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-800 rounded cursor-pointer transition-all text-sm"
              >
                {/* 왼쪽: 로고 + 이름 */}
                <div className="flex items-center gap-2">
                  <img
                    src={`https://static.upbit.com/logos/${symbol}.png`}
                    alt={coin.market}
                    className="w-5 h-5 rounded-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/616/616408.png";
                    }}
                  />
                  <span className="text-gray-200 truncate max-w-[100px]">
                    {marketNames[coin.market] || coin.market}
                  </span>
                </div>

                {/* 오른쪽: 보유 수량 */}
                <div className="text-right text-gray-400 font-medium">
                  {formatQuantity(coin.quantity)} 개
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyHoldingsPanel;
