let ecoChart = null;
let ratingChart = null;

function fetchResults() {
  const user = document.getElementById('username').value.toLowerCase();
  const year = document.getElementById('year').value;
  let month = document.getElementById('month').value;

  if (!user || !year || !month) {
    alert('Preencha todos os campos');
    return;
  }

  month = month.toString().padStart(2, '0');

  fetch(`https://api.chess.com/pub/player/${user}/games/${year}/${month}`)
    .then(res => {
      if (!res.ok) throw new Error('Dados não encontrados');
      return res.json();
    })
    .then(data => processGames(data.games || [], user))
    .catch(err => {
      document.getElementById('result').innerText = err.message;
      destroyCharts();
    });
}

function processGames(games, user) {
  if (games.length === 0) {
    document.getElementById('result').innerText = 'Nenhuma partida encontrada.';
    destroyCharts();
    return;
  }

  let wins = 0, losses = 0, draws = 0;
  const ecoCount = {};
  const dates = [];
  const dateCounts = {};
  const ratingLabels = [];
  const ratingValues = [];

  // Primeiro, calcule quantas partidas por data
  games.forEach(game => {
    const dateStr = new Date(game.end_time * 1000)
      .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    dates.push(dateStr);
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  // Agora processe cada partida
  games.forEach((game, i) => {
    const isWhite = game.white.username.toLowerCase() === user;
    const isBlack = game.black.username.toLowerCase() === user;
    if (!isWhite && !isBlack) return;

    // Conte resultados
    const result = isWhite ? game.white.result : game.black.result;
    if (result === 'win') wins++;
    else if (['stalemate','agreed','repetition','timevsinsufficient'].includes(result)) draws++;
    else losses++;

    // Conte ECOs
    const ecoRaw = game.eco || 'Desconhecido';
    const ecoName = ecoRaw.split('/openings/').pop();
    ecoCount[ecoName] = (ecoCount[ecoName] || 0) + 1;

    // Prepare rating e labels
    const rating = isWhite ? game.white.rating : game.black.rating;
    const dateStr = dates[i];        // já formatado
    ratingValues.push(rating);
    ratingLabels.push(`${dateStr} (#${i+1})`);
  });

  // Exibe texto e gráficos
  renderResultText(wins, losses, draws, ecoCount);
  renderEcoChart(ecoCount);
  renderRatingChart(ratingLabels, ratingValues, dateCounts);
}

function renderResultText(w, l, d, ecoCount) {
  const total = w + l + d;
  let html = `
    <p>Total de partidas no mês: ${total}</p>
    <p>Vitórias: ${w}</p>
    <p>Derrotas: ${l}</p>
    <p>Empates: ${d}</p>
    <h3>Top 5 Aberturas</h3>
    <ul>
  `;
  Object.entries(ecoCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([eco, count]) => {
      const pct = ((count / total) * 100).toFixed(2);
      html += `<li>${eco}: ${count} partidas (${pct}%)</li>`;
    });
  html += '</ul>';
  document.getElementById('result').innerHTML = html;
}

function renderEcoChart(ecoCount) {
  const entries = Object.entries(ecoCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const labels = entries.map(e => e[0]);
  const data = entries.map(e => e[1]);

  if (ecoChart) ecoChart.destroy();
  const ctx = document.getElementById('ecoChart').getContext('2d');
  ecoChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: '#3498db' }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } }
    }
  });
}

function renderRatingChart(labels, values, dateCounts) {
  if (ratingChart) ratingChart.destroy();
  const ctx = document.getElementById('ratingChart').getContext('2d');

  ratingChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Rating por Partida',
        data: values,
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231,76,60,0.2)',
        tension: 0.3,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            callback: function(value) {
              const fullLabel = this.getLabelForValue(value);
              const dateOnly = fullLabel.split(' ')[0];
              const count = dateCounts[dateOnly] || 0;
              return `${dateOnly} (${count})`;
            }
          },
          title: {
            display: true,
            text: 'Data (qtde de jogos no dia)'
          }
        },
        y: {
          beginAtZero: false,
          title: { display: true, text: 'Rating' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: ctxArr => ctxArr[0].label,
            label: ctx => `Rating: ${ctx.parsed.y}`
          }
        }
      }
    }
  });
}

function destroyCharts() {
  if (ecoChart) ecoChart.destroy();
  if (ratingChart) ratingChart.destroy();
}