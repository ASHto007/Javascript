const STOCKS = [
  "AAPL","MSFT","GOOGL","AMZN","PYPL",
  "TSLA","JPM","NVDA","NFLX","DIS"
];

export function renderList(statsData, onSelect) {
  const list = document.getElementById("stockList");
  list.innerHTML = "";

  STOCKS.forEach(stock => {
    const data = statsData.stocksStatsData[0][stock];
    if (!data) return;

    const div = document.createElement("div");
    div.className = "stock";

    div.innerHTML = `
      <strong>${stock}</strong>
      <span>$${data.bookValue}</span>
      <span class="${data.profit > 0 ? "profit" : "loss"}">
        ${Number(data.profit).toFixed(2)}%
      </span>
    `;

    div.onclick = () => onSelect(stock);
    list.appendChild(div);
  });
}
