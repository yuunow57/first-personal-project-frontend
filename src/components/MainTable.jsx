// src/components/MainTable.jsx
function MainTable({ coins, prices, onSelect }) {
  // 현재가 내림차순 정렬
  const rows = coins
    .map((c) => ({ coin: c, p: prices[c.market] }))
    .filter((r) => r.p?.trade_price)
    .sort((a, b) => b.p.trade_price - a.p.trade_price);

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">실시간 시세</h2>
        <span className="text-xs text-gray-400">
          가격 내림차순 • {rows.length} 종목
        </span>
      </div>

      <div className="overflow-auto max-h-[520px]">
        <table className="w-full text-sm">
          <thead className="text-gray-400 sticky top-0 bg-gray-800">
            <tr>
              <th className="py-2 px-3 text-left">종목</th>
              <th className="py-2 px-3 text-right">현재가</th>
              <th className="py-2 px-3 text-right">등락률</th>
              <th className="py-2 px-3 text-right">거래대금(24h)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ coin, p }) => {
              const price = p.trade_price ?? 0;
              const changeRate = (p.signed_change_rate ?? 0) * 100;
              const vol = p.acc_trade_price_24h ?? 0;
              return (
                <tr
                  key={coin.market}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => onSelect?.(coin.market)}
                >
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{coin.korean_name}</span>
                      <span className="text-xs text-gray-400">
                        {coin.market}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {Number(price).toLocaleString()} 원
                  </td>
                  <td
                    className={`py-2 px-3 text-right ${
                      changeRate > 0 ? "text-red-400" : "text-blue-400"
                    }`}
                  >
                    {changeRate.toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-right">
                    {Math.round(vol).toLocaleString()} 원
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainTable;
