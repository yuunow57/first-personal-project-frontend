import { useEffect, useState } from "react";
import api from "../services/api";
import MainTable from "../components/MainTable";
import SideMovers from "../components/SideMovers";
import VolumeGrid from "../components/VolumeGrid";
import ChartModal from "../components/ChartModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"; // ✅ 추가

function DashboardPage() {
  const [coins, setCoins] = useState([]);
  const [prices, setPrices] = useState({});
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [openChart, setOpenChart] = useState(false);

  // ✅ 코인 목록 불러오기
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await api.get("/coins");
        setCoins(data.coins);
      } catch (err) {
        console.error("❌ 코인 목록 불러오기 실패:", err);
      }
    };
    fetchCoins();
  }, []);

  // ✅ 실시간 시세 불러오기
  useEffect(() => {
    if (coins.length === 0) return;

    const loadPrices = async () => {
      try {
        const { data } = await api.get("/prices");
        setPrices(data.prices);
      } catch (e) {
        console.error("❌ 시세 불러오기 실패:", e);
      }
    };

    loadPrices();
    const timer = setInterval(loadPrices, 5000);
    return () => clearInterval(timer);
  }, [coins]);

  // ✅ 차트 모달 열기
  const openChartFor = (market) => {
    setSelectedMarket(market);
    setOpenChart(true);
  };

  return (
    <div className="min-h-screen bg-[#17171C] text-white flex flex-col">
      {/* ✅ 상단 네비게이션 */}
      <NavBar />

      {/* ✅ 메인 콘텐츠 */}
      <main className="flex-1 pt-20 flex justify-center">
        <div className="w-full max-w-7xl p-6 grid grid-cols-12 gap-6">
          
          {/* 중앙: 메인 테이블 + 거래량 */}
          <div className="col-span-12 lg:col-span-8 text-sm space-y-8 border-r border-gray-800 pr-6">
            <MainTable coins={coins} prices={prices} onSelect={openChartFor} />
            <VolumeGrid coins={coins} prices={prices} onSelect={openChartFor} />
          </div>

          {/* 우측: 변동률 TOP/BOTTOM */}
          <div className="col-span-12 lg:col-span-4 text-sm">
            <SideMovers coins={coins} prices={prices} onSelect={openChartFor} />
          </div>

          {/* 차트 모달 */}
          <ChartModal
            market={selectedMarket}
            open={openChart}
            onClose={() => setOpenChart(false)}
          />
        </div>
      </main>

      {/* ✅ 하단 정보형 Footer */}
      <Footer />
    </div>
  );
}

export default DashboardPage;
