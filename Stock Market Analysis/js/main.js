import { fetchAllData } from "./api.js";
import { renderChart } from "./chart.js";
import { renderList } from "./list.js";
import { renderDetails } from "./details.js";

let chartData, statsData, profileData;
let currentStock = "AAPL";
let currentRange = "1mo";

async function init() {
  const data = await fetchAllData();
  chartData = data.charts;
  statsData = data.stats;
  profileData = data.profile;

  renderList(statsData, selectStock);
  updateUI();
}

function selectStock(stock) {
  currentStock = stock;
  updateUI();
}

function updateUI() {
  renderChart(chartData, currentStock, currentRange);
  renderDetails(currentStock, statsData, profileData);
}

document.querySelectorAll("[data-range]").forEach((btn) => {
  btn.onclick = () => {
    currentRange = btn.dataset.range;
    updateUI();
  };
});

init();
