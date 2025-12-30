const STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];

const BASE = "https://stock-market-api-k9vl.onrender.com/api";

let chartData;
let statsData;
let profileData;
let currentStock = "AAPL";
let currentRange = "1mo";
let chart;

// ---------------- FETCH DATA ----------------
async function fetchData() {
  const [charts, stats, profile] = await Promise.all([
    fetch(`${BASE}/stocksdata`).then((r) => r.json()),
    fetch(`${BASE}/stocksstatsdata`).then((r) => r.json()),
    fetch(`${BASE}/profiledata`).then((r) => r.json()),
  ]);

  chartData = charts;
  statsData = stats;
  console.log(statsData);
  profileData = profile;
}

// ---------------- RENDER LIST ----------------
function renderList() {
  const list = document.getElementById("stockList");
  list.innerHTML = "";

  STOCKS.forEach((stock) => {
    const data = statsData.stocksStatsData[0][stock]; //
    console.log(data);

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

    div.onclick = () => {
      currentStock = stock;
      updateUI();
    };

    list.appendChild(div);
  });
}

// ---------------- RENDER DETAILS ----------------
function renderDetails() {
  const details = document.getElementById("details");
  const stats = statsData.stocksStatsData[0][currentStock]; // ✅ CORRECT
  const profile = profileData.stocksProfileData[0][currentStock];

  if (!stats || !profile) return;

  details.innerHTML = `
    <h3>${currentStock}</h3>
    <p>Book Value: $${stats.bookValue}</p>
    <p class="${stats.profit > 0 ? "profit" : "loss"}">
      Profit: ${stats.profit}%
    </p>
    <p>${profile.summary}</p>
  `;
}

// ---------------- RENDER CHART ----------------
function renderChart() {
  const ctx = document.getElementById("stockChart");

  const stockInfo = chartData.stocksData[0][currentStock][currentRange];

  const labels = stockInfo.timeStamp.map((ts) =>
    new Date(ts * 1000).toLocaleDateString()
  );
  const prices = stockInfo.value;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: currentStock,
          data: prices,
          borderColor: "#4cff00",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
    },
  });

  const high = Math.max(...prices);
  const low = Math.min(...prices);

  document.getElementById(
    "highLow"
  ).innerText = `Peak: $${high} | Low: $${low}`;
}

// ---------------- UPDATE UI ----------------
function updateUI() {
  renderChart();
  renderDetails();
}

// ---------------- BUTTON EVENTS ----------------
document.querySelectorAll("[data-range]").forEach((btn) => {
  btn.onclick = () => {
    currentRange = btn.dataset.range;
    updateUI();
  };
});

// ---------------- INIT ----------------
async function init() {
  await fetchData();
  renderList();
  updateUI();
}

init();
