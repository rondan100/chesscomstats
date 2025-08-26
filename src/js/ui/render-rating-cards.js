export function renderRatingCards({ labels, values }) {
    const container = document.getElementById('ratingCards');
    container.innerHTML = ''; // limpa
  
    Object.entries(statsByType).forEach(([type, { current, delta }]) => {
      const arrow = delta >= 0
        ? `<span class="up">▲ +${delta}</span>`
        : `<span class="down">▼ ${delta}</span>`;
  
      const label = type === 'rapid'
        ? 'Rápidas'
        : type.charAt(0).toUpperCase() + type.slice(1);
  
      const card = document.createElement('div');
      card.className = `rating-card ${type}`;
      card.innerHTML = `
        <div class="type">${label}</div>
        <div class="value">${current}</div>
        <div class="delta">${arrow}</div>
      `;
      container.append(card);
    });
  }