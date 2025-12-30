const BASE = "https://stock-market-api-k9vl.onrender.com/api";

export async function fetchAllData() {
  const [charts, stats, profile] = await Promise.all([
    fetch(`${BASE}/stocksdata`).then(r => r.json()),
    fetch(`${BASE}/stocksstatsdata`).then(r => r.json()),
    fetch(`${BASE}/profiledata`).then(r => r.json())
  ]);

  return { charts, stats, profile };
}
