// src/js/ui/rnder-rating-cards.js'
// Função para renderizar os cards
import { getStatsByType } from '../data/get-stats-by-type.js';

export function renderRatingCards(games, username) {
  const statsByType = getStatsByType(games, username);
  const container = document.getElementById('ratingCards');
  container.innerHTML = ''; // limpa antes

  Object.entries(statsByType).forEach(([type, { current, delta }]) => {
    const arrow = delta >= 0
      ? `<span class="arrow up"> ▲+${delta}</span>`
      : `<span class="arrow down"> ▼${delta}</span>`;

    const labelMap = {
      rapid: 'Rápidas',
      blitz: 'Blitz',
      bullet: 'Bullet'
    };

    const label = labelMap[type] || type;

    const card = document.createElement('div');
    card.className = `rating-card ${type}`;
    card.innerHTML = `
      <div class="value">${current}${arrow}</div>
    `;
    container.append(card);
  });
}
