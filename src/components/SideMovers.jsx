// src/components/SideMovers.jsx
function SideMovers({ coins, prices }) {
  const enriched = coins
    .map((c) => {
      const p = prices[c.market];
      return p
        ? {
            market: c.market,
            name: c.korean_name,
            rate: (p.signed_change_rate ?? 0) * 100,
            price: p.trade_price ?? 0,
          }
        : null;
    })
    .filter(Boolean);

  const top10 = [...enriched]
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10);
  const bottom10 = [...enriched]
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 10);

  const Item = ({ item }) => (
    <div className="flex justify-between py-1">
      <span className="truncate">{item.name}</span>
      <span
        className={item.rate > 0 ? "text-red-400" : "text-blue-400"}
        title={`${item.price.toLocaleString()} 원`}
      >
        {item.rate.toFixed(2)}%
      </span>
    </div>
  );

  return (
    <aside className="bg-gray-800 p-4 rounded-xl shadow h-full">
      <h3 className="text-base font-semibold mb-2">상승 TOP 10</h3>
      <div className="text-sm mb-4">
        {top10.map((it) => (
          <Item key={it.market} item={it} />
        ))}
      </div>

      <h3 className="text-base font-semibold mb-2">하락 TOP 10</h3>
      <div className="text-sm">
        {bottom10.map((it) => (
          <Item key={it.market} item={it} />
        ))}
      </div>
    </aside>
  );
}

export default SideMovers;
