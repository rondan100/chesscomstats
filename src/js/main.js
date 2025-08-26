// src/js/main.js
import { fetchGamesByRange } from './api.js';
import { processGames }      from './data/process-games.js';
import { renderResultText }  from './ui/render-result.js';
import { renderEcoChart }    from './chart/eco-chart.js';
import { renderRatingChart } from './chart/rating-chart.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const user  = document.getElementById('username').value.trim().toLowerCase();
    const days  = Number(document.getElementById('rangeSelect').value);

    if (!user) return alert('Informe ao menos o nome do usuário.');

    try {
      // busca partidas só dos últimos X dias
      const games = await fetchGamesByRange(user, days);

      if (games.length === 0) {
        document.getElementById('result').innerText = 'Nenhuma partida encontrada.';
        return;
      }

      // processa stats, ECOs e ratings
      const stats = processGames(games, user);

      // rende resultados e gráficos
      renderResultText(stats);
      renderEcoChart(stats.ecoCount);
      renderRatingChart(stats.ratingsInfo, stats.dateCounts);

    } catch (err) {
      console.error(err);
      document.getElementById('result').innerText = err.message;
    }
  });
});