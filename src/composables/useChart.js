import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// 차트 인스턴스 변수 외부로 빼기
let categoryChartInstance = null;
let weeklyChartInstance = null;

export const renderCategoryChart = (ctx, periodStat) => {
  if (categoryChartInstance) categoryChartInstance.destroy();

  const labels = Object.keys(periodStat.category);
  const data = Object.values(periodStat.category);
  const isEmpty = labels.length === 0 || data.reduce((a, b) => a + b, 0) === 0;
  const backgroundColors = generateColors(labels.length);

  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: isEmpty ? ['데이터 없음'] : labels,
      datasets: [
        {
          data: isEmpty ? [1] : data,
          backgroundColor: isEmpty ? ['#d3d3d3'] : backgroundColors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        tooltip: {
          callbacks: {
            title: () => '',
            label: (context) => context.label,
          },
        },
        datalabels: {
          color: 'white',
          formatter: function (value, context) {
            const data = context.chart.data.datasets[0].data;
            const total = data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
          anchor: 'center',
          align: 'center',
          font: {
            weight: 'bold',
            size: '12em',
          },
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 4,
            padding: 20,
            generateLabels: (chart) => {
              const raw = chart.data.labels.map((label, i) => ({
                label,
                value: chart.data.datasets[0].data[i],
                color: chart.data.datasets[0].backgroundColor[i],
                index: i,
              }));
              const total = raw.reduce((sum, item) => sum + item.value, 0);
              raw.sort((a, b) => b.value - a.value);
              return raw.map(({ label, value, color, index }) => {
                const percentage = ((value / total) * 100).toFixed(0);
                return {
                  text: `${label} ${value.toLocaleString()}원 (${percentage}%)`,
                  fillStyle: color,
                  strokeStyle: color,
                  index,
                };
              });
            },
          },
          onClick: () => {},
        },
      },
    },
    plugins: [ChartDataLabels],
  });
};

export const renderWeeklyChart = (ctx, incomes, expenses) => {
  if (weeklyChartInstance) weeklyChartInstance.destroy();

  weeklyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [
        {
          label: '지출',
          data: expenses,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 7,
        },
        {
          label: '수입',
          data: incomes,
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { display: false },
          beginAtZero: true,
          ticks: {
            callback: (value) => `₩${value.toLocaleString()}`,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            label: (context) => `₩${context.parsed.y.toLocaleString()}`,
          },
        },
      },
    },
  });
};

const generateColors = (count) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#28a745',
    '#0d6efd',
    '#ffc107',
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};
