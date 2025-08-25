// src/js/chart/eco-chart.js

let ecoChart = null;

export function renderEcoChart(ecoCount) {
  const entries = Object.entries(ecoCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0,5);
  const labels = entries.map(e => e[0]);
  const data   = entries.map(e => e[1]);

  if (ecoChart) ecoChart.destroy();
  const ctx = document.getElementById('ecoChart').getContext('2d');
  ecoChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets:[{ data, backgroundColor:'#3498db' }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend:{ display:false } },
      scales: { x:{ beginAtZero:true } }
    }
  });
}