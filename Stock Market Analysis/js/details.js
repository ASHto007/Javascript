export function renderDetails(stock, statsData, profileData) {
  const details = document.getElementById("details");

  const stats = statsData.stocksStatsData[0][stock];
  const profile = profileData.stocksProfileData[0][stock];

  if (!stats || !profile) return;

  details.innerHTML = `
    <h3>${stock}</h3>
    <p>Book Value: $${stats.bookValue}</p>
    <p class="${stats.profit > 0 ? "profit" : "loss"}">
      Profit: ${Number(stats.profit).toFixed(2)}%
    </p>
    <p>${profile.summary}</p>
  `;
}
