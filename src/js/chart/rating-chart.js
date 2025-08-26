// src/js/chart/rating-chart.js

let ratingChart = null;

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
              const total   = ticks.length;
              const chart  = this.chart;
              const width  = chart.width; 

              // define quantos px cada label precisa
              const minPx  = 35;
              // calcula quantos labels cabem
              const maxTicks = Math.floor(width / minPx) || 1;
              // passo para percorrer todos os labels
              const step   = Math.ceil(total / maxTicks);

              // prepara label formatado
              const fullLabel = this.getLabelForValue(value);
              const dateOnly  = fullLabel.split(' ')[0];
              const cnt       = dateCounts[dateOnly] || 0;
              const label     = `${dateOnly} (${cnt})`;

              // Se for igual ao anterior, retorna string vazia (sem label)
              if (dateOnly === lastDayTick) {
                return '';
              }

              // exibe sempre o último dia
              if (index === total - 1) return label;
              // exibe só a cada "step"
              if (index % step !== 0) return '';
              return label;

             // return `${dateOnly} (${cnt})`;
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