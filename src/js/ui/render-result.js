// src/js/ui/render-result.js
export function renderResultText({ wins, losses, draws, ecoCount }) {
    const total = wins + losses + draws;
    let html = `
      <p>Total de partidas no mês: ${total}</p>
      <p>Vitórias: ${wins}</p>
      <p>Derrotas: ${losses}</p>
      <p>Empates: ${draws}</p>
      <h3>Top 5 Aberturas</h3>
      <ul>
    `;
    Object.entries(ecoCount)
      .sort((a,b) => b[1] - a[1])
      .slice(0,5)
      .forEach(([eco, count]) => {
        const pct = ((count/total)*100).toFixed(2);
        html += `<li>${eco}: ${count} partidas (${pct}%)</li>`;
      });
    html += '</ul>';
    document.getElementById('result').innerHTML = html;
  }