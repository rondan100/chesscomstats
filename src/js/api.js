// src/js/api.js
export async function fetchGamesByRange(username, days, tipo) {
  // 1) Puxar os URLs de todos os meses
  const archivesRes = await fetch(
    `https://api.chess.com/pub/player/${username}/games/archives`
  );
  if (!archivesRes.ok) throw new Error('Usuário não encontrado ou sem arquivos.');
  const { archives } = await archivesRes.json();

  // 2) Calcular limite de data
  const now           = Date.now();
  const thresholdTime = now - days * 24 * 60 * 60 * 1000;
  const thresholdDate = new Date(thresholdTime);
  const thresholdMonthStart = new Date(
    thresholdDate.getFullYear(),
    thresholdDate.getMonth(),
    1
  );

  // 3) Selecionar só os arquivos mensais relevantes
  const relevant = archives.filter(url => {
    const [, year, month] = url.match(/(\d{4})\/(\d{2})$/) || [];
    if (!year || !month) return false;
    const archiveDate = new Date(+year, +month - 1, 1);
    return archiveDate >= thresholdMonthStart;
  });

  // 4) Fazer fetch paralelo, achatar e filtrar por thresholdTime
  const batches = await Promise.all(
    relevant.map(url =>
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Falha ao baixar mês de jogos.');
          return res.json();
        })
        .then(json => (json.games || []).filter(game => game.time_class === tipo && game.rules === "chess") // 🔥 filtro por tipo e rules chess
      )
    )
  );
  const allGames = batches.flat();

  // 5) Filtrar só as partidas cujo end_time seja ≥ thresholdTime
  return allGames.filter(g => g.end_time * 1000 >= thresholdTime);
}