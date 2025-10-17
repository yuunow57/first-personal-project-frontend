import React from "react";

function SideMovers({ coins, prices, onSelect }) {
  if (!coins?.length || !Object.keys(prices).length)
    return <div className="text-gray-400 text-sm">데이터 로딩 중...</div>;

  const movers = coins
    .map((c) => {
      const data = prices[c.market];
      if (!data?.change) return null;
      return {
        ...c,
        price: data.price,
        rate: data.change,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.rate - a.rate);

  const top10 = movers.slice(0, 10);
  const bottom10 = movers.slice(-10).reverse();

  return (
    <div className="bg-[#17171C] rounded-2xl p-4 h-[92vh] overflow-y-auto">
      <h2 className="text-white text-lg font-semibold mb-3 text-center">
        📈 상승률 TOP 10
      </h2>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left">#</th>
            <th className="text-left">코인</th>
            <th className="text-right">현재가</th>
            <th className="text-right">변동률</th>
          </tr>
        </thead>
        <tbody>
          {top10.map((c, idx) => (
            <tr
              key={c.market}
              onClick={() => onSelect(c.market)}
              className="hover:bg-gray-800 cursor-pointer border-b border-gray-800"
            >
              <td className="text-gray-500">{idx + 1}</td>
              <td className="text-white font-medium">{c.korean_name}</td>
              <td className="text-right text-gray-300">
                {Number(c.price).toLocaleString()}
              </td>
              <td
                className={`text-right font-semibold ${
                  c.rate >= 0 ? "text-red-400" : "text-blue-400"
                }`}
              >
                {(c.rate * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-white text-lg font-semibold mb-3 text-center">
        📉 하락률 TOP 10
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left">#</th>
            <th className="text-left">코인</th>
            <th className="text-right">현재가</th>
            <th className="text-right">변동률</th>
          </tr>
        </thead>
        <tbody>
          {bottom10.map((c, idx) => (
            <tr
              key={c.market}
              onClick={() => onSelect(c.market)}
              className="hover:bg-gray-800 cursor-pointer border-b border-gray-800"
            >
              <td className="text-gray-500">{idx + 1}</td>
              <td className="text-white font-medium">{c.korean_name}</td>
              <td className="text-right text-gray-300">
                {Number(c.price).toLocaleString()}
              </td>
              <td
                className={`text-right font-semibold ${
                  c.rate >= 0 ? "text-red-400" : "text-blue-400"
                }`}
              >
                {(c.rate * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SideMovers;
