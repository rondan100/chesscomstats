// src/js/api.js
export async function fetchGames(user, year, month) {
  const paddedMonth = month.toString().padStart(2, '0');
  const url = `https://api.chess.com/pub/player/${user}/games/${year}/${paddedMonth}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Dados não encontrados');
  const { games = [] } = await res.json();
  return games;
}