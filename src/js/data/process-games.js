// src/js/data/process-games.js
export function processGames(games, user) {
    let wins = 0, losses = 0, draws = 0;
    const ecoCount    = {};
    const dateCounts  = {};
    const ratingsInfo = { labels: [], values: [] };
  
    // 1) Primeiro passe para contar quantos jogos por dia
    const dates = games.map(({ end_time }) => {
      const dateStr = new Date(end_time * 1000)
        .toLocaleDateString('pt-BR',{ day:'2-digit', month:'2-digit' });
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      return dateStr;
    });
  
    // 2) Segundo passe para calcular vitórias/derrotas/eços/ratings
    games.forEach((game, i) => {
      const white = game.white.username.toLowerCase() === user;
      const black = game.black.username.toLowerCase() === user;
      if (!white && !black) return;
  
      // resultado
      const result = white ? game.white.result : game.black.result;
      if (result === 'win') {wins++;}
      else if ([
        "stalemate",
        "agreed",
        "repetition",
        "timevsinsufficient",
        "insufficient",
        "50move"
      ].includes(result)) draws++;
      else if ([
        "checkmated",
        "resigned",
        "timeout",
        "lose",
        "abandoned"
      ].includes(result)) {losses++;}
      else console.log("⚠️ Resultado não mapeado:", result);
  
      // ECO
      const ecoRaw  = game.eco || 'Desconhecido';
      const ecoName = ecoRaw.split('/openings/').pop();
      ecoCount[ecoName] = (ecoCount[ecoName] || 0) + 1;
  
      // rating + label
      const rating    = white ? game.white.rating : game.black.rating;
      const dateStr   = dates[i];
      ratingsInfo.values.push(rating);
      ratingsInfo.labels.push(`${dateStr} (#${i+1})`);
    });
  
    return { wins, losses, draws, ecoCount, dateCounts, ratingsInfo };
  }