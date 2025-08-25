// src/js/chart/rating-chart.js

let ratingChart = null;

export function renderRatingChart(ratingsInfo, dateCounts) {
  const { labels, values } = ratingsInfo;
  if (ratingChart) ratingChart.destroy();

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
          ticks: {
            callback: function(value) {
              const fullLabel = this.getLabelForValue(value);
              const dateOnly  = fullLabel.split(' ')[0];
              const cnt       = dateCounts[dateOnly] || 0;
              return `${dateOnly} (${cnt})`;
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