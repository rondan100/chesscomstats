// main.js
import { fetchGames }       from './api.js';
import { processGames }     from './data/process-games.js';
import { renderResultText } from './ui/render-result.js';
import { renderEcoChart }   from './chart/eco-chart.js';
import { renderRatingChart }from './chart/rating-chart.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('filterForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const user  = document.getElementById('username').value.trim().toLowerCase();
    const year  = document.getElementById('year').value;
    const month = document.getElementById('month').value;

    // 1) Username continua obrigatório
    if (!username) {
        return res.status(400).json({ error: 'O campo username é obrigatório.' });
    }
    
    // 2) Se um dos filtros de data vier sem o outro, aí sim dá erro
    if ((year && !month) || (!year && month)) {
        return res
        .status(400)
        .json({ error: 'Informe ambos ano e mês para filtrar ou nenhum dos dois.' });
    }

    try {
      const games = await fetchGames(user, year, month);
      if (games.length === 0) {
        document.getElementById('result').innerText = 'Nenhuma partida encontrada.';
        return;
      }

      const stats = processGames(games, user);
      renderResultText(stats);
      renderEcoChart(stats.ecoCount);
      renderRatingChart(stats.ratingsInfo, stats.dateCounts);

    } catch (err) {
      console.error(err);
      document.getElementById('result').innerText = err.message;
    }
  });
});