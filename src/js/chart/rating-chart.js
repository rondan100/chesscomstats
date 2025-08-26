// src/js/chart/rating-chart.js

let ratingChart = null;
// fora do callback (no mesmo escopo do renderRatingChart), reseta a cada render:
let shownDays = new Set();

export function renderRatingChart(ratingsInfo, dateCounts) {
  const { labels, values } = ratingsInfo;
  if (ratingChart) ratingChart.destroy();

  // Variável de controle para não repetir data
  let lastDayTick = null;
  const ctx = document.getElementById('ratingChart').getContext('2d');
  ratingChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets:[{
        label: 'Rating por Partida',
        data: values,
        borderColor:'#e74c3c',
        backgroundColor:'rgba(231,76,60,0.2)',
        tension:0.3,
        pointRadius:4
      }]
    },
    options: {
      responsive:true,
      scales: {
        x: {
          distribution: 'series',
          time: {
            unit: 'day',
            // força marcações diárias
            stepSize: 1,
            displayFormats: { day: 'DD/MM' },
            minUnit: 'day'            // força usar dia como menor unidade
          },
          ticks: {
            autoSkip: false,
            callback(value, index, ticks) {
              const total = ticks.length;
              const chart = this.chart;
              const width = chart.width;
          
              // pega label e dia
              const fullLabel = this.getLabelForValue(value);
              const dateOnly  = String(fullLabel).split(' ')[0];
              const cnt       = dateCounts[dateOnly] || 0;
              const label     = `${dateOnly} (${cnt})`;
          
              // calcula espaçamento dinâmico
              const charWidth = 2; // px médio por caractere
              const minPx     = Math.max(40, Math.min(120, label.length * charWidth));
              const maxTicks  = Math.floor(width / minPx) || 1;
              const step      = Math.ceil(total / maxTicks);
          
              // --- regras ---
              // 1) sempre mostrar o primeiro tick
              if (index === 0) {
                shownDays.add(dateOnly);
                return label;
              }
          
              // 2) sempre mostrar o último tick
              if (index === total - 1) {
                shownDays.add(dateOnly);
                return label;
              }

              // 3) sempre mostrar o medio tick
              if (index === (total+1)/2) {
                shownDays.add(dateOnly);
                return label;
              }
          
              // 4) evitar dias repetidos
              if (shownDays.has(dateOnly)) return '';
          
              // 5) mostrar apenas de acordo com o step
              if (index % step !== 0) return '';
          
              shownDays.add(dateOnly);
              return label;
            }
          },
      title: { display:true, text:'Data (qtde de jogos no dia)' }
        },
        y: {
          beginAtZero:false,
          title:{ display:true, text:'Rating' }
        }
      },
      plugins: {
        legend:{ display:false },
        tooltip:{
          callbacks:{
            title: ctxArr => ctxArr[0].label,
            label: ctx => `Rating: ${ctx.parsed.y}`
          }
        }
      }
    }
  });
}