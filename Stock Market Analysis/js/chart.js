let chart;

export function renderChart(chartData, stock, range) {
  const ctx = document.getElementById("stockChart");

  const stockInfo = chartData.stocksData[0][stock][range];

  const labels = stockInfo.timeStamp.map(ts =>
    new Date(ts * 1000).toLocaleDateString()
  );

  const prices = stockInfo.value;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: stock,
        data: prices,
        borderColor: "#4cff00",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false }
    }
  });

  const high = Math.max(...prices);
  const low = Math.min(...prices);

  document.getElementById("highLow").innerText =
    `Peak: $${high} | Low: $${low}`;
}
