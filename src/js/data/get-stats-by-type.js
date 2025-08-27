// src/js/data/get-stats-by-type.js'
// Função para extrair o último e penúltimo rating de cada tipo
export function getStatsByType(matches, username) {
  const statsByType = {};

  matches.forEach(match => {
    const type = match.time_class; // ex: "rapid", "blitz", "bullet"
    const rating = match.white.username.toLowerCase() === username.toLowerCase()
      ? match.white.rating
      : match.black.rating;

    if (!statsByType[type]) {
      statsByType[type] = { ratings: [] };
    }
    statsByType[type].ratings.push(rating);
  });

  // Pega só o último e o penúltimo para calcular delta
  Object.keys(statsByType).forEach(type => {
    const ratings = statsByType[type].ratings;
    const last = ratings[ratings.length - 1] || 0;
    const prev = ratings[0] || last;
    const delta = last - prev;

    statsByType[type] = { current: last, delta };
  });

  return statsByType;
}
