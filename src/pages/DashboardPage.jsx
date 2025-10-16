import { useEffect, useState } from "react";
import api from "../services/api";
import MainTable from "../components/MainTable";
import SideMovers from "../components/SideMovers";
import VolumeGrid from "../components/VolumeGrid";
import ChartModal from "../components/ChartModal";

function DashboardPage() {
  const [coins, setCoins] = useState([]);
  const [prices, setPrices] = useState({});
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [openChart, setOpenChart] = useState(false);

  // ✅ KRW 마켓 종목 불러오기
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await api.get("/coins");
        const krwCoins = data.coins.filter((coin) => coin.market.startsWith("KRW-"));
        setCoins(krwCoins);
      } catch (err) {
        console.error("❌ 코인 목록 불러오기 실패:", err);
      }
    };
    fetchCoins();
  }, []);

  // ✅ 시세 폴링
  useEffect(() => {
    if (coins.length === 0) return;

    const loadPrices = async () => {
      try {
        const map = {};
            for (const c of coins.slice(0, 30)) { // 우선 상위 30개만
                try {
                    const { data } = await api.get(`/price/${c.market}`);
                    map[c.market] = {
                        trade_price: data.price,
                        signed_change_rate: data.change,
                    };
                } catch (err) {
                console.warn(`❌ ${c.market} 시세 실패`);
                }
            }
        setPrices(map);
      } catch (e) {
        console.error("❌ 시세 불러오기 실패:", e);
      }
    };

    loadPrices();
    const timer = setInterval(loadPrices, 5000);
    return () => clearInterval(timer);
  }, [coins]);

  const openChartFor = (market) => {
    setSelectedMarket(market);
    setOpenChart(true);
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-6 bg-gray-900 text-white min-h-screen">
      {/* 중앙: 시세 테이블 */}
      <div className="col-span-12 lg:col-span-8">
        <MainTable coins={coins} prices={prices} onSelect={openChartFor} />
        <VolumeGrid coins={coins} prices={prices} onSelect={openChartFor} />
      </div>

      {/* 우측: 변동률 TOP/BOTTOM 10 */}
      <div className="col-span-12 lg:col-span-4">
        <SideMovers coins={coins} prices={prices} />
      </div>

      {/* 차트 모달 */}
      <ChartModal
        market={selectedMarket}
        open={openChart}
        onClose={() => setOpenChart(false)}
      />
    </div>
  );
}

export default DashboardPage;
