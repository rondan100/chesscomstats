// src/js/ui/render-result.js
export function renderResultBar({ wins, losses, draws, ecoCount }) {
  const total = wins + losses + draws;
  const winPct   = ((wins / total) * 100).toFixed(2);
  const drawPct  = ((draws / total) * 100).toFixed(2);
  const lossPct  = ((losses / total) * 100).toFixed(2);

  let html = `
    <p>Total de partidas: ${total}</p>
    
    <div style="display:flex; height: 30px; border-radius: 5px; overflow: hidden; font-size: 14px; color: white; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.7)">
      <div style="background-color: #4caf50; width: ${winPct}%; display:flex; justify-content:center; align-items:center;">
        ${wins} (${winPct}%)
      </div>
      <div style="background-color: #9e9e9e; width: ${drawPct}%; display:flex; justify-content:center; align-items:center; font-size: ${drawPct < 8 ? '10px' : '14px'};">
        ${draws} (${drawPct}%)
      </div>
      <div style="background-color: #f44336; width: ${lossPct}%; display:flex; justify-content:center; align-items:center;">
        ${losses} (${lossPct}%)
      </div>
    </div>

    <h3>Top 3 Aberturas</h3>
    <ul>
  `;

  Object.entries(ecoCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0,3)
    .forEach(([eco, count]) => {
      const pct = ((count/total)*100).toFixed(2);
      html += `<li>${eco}: ${count} partidas (${pct}%)</li>`;
    });

  html += '</ul>';
  document.getElementById('result').innerHTML = html;
}
