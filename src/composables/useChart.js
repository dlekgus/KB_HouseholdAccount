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

const groupByDate = (data, periodMonths) => {
  const isMonthly = periodMonths >= 3;
  const result = {};

  data.forEach((item) => {
    const dateObj = new Date(item.date);
    const key = isMonthly
      ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
          2,
          '0'
        )}` // 월 단위
      : dateObj.toISOString().slice(0, 10); // 일 단위

    result[key] = (result[key] || 0) + item.amount;
  });

  return result;
};

const formatPeriodLabel = (start, end) => {
  const isMonthly = start.length === 7; // YYYY-MM

  if (isMonthly) {
    return `${start.replace('-', '.')} ~ ${end.replace('-', '.')}`;
  } else {
    const format = (dateStr) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}.${String(d.getDate()).padStart(2, '0')}`;
    };
    return `${format(start)} ~ ${format(end)}`;
  }
};

export const renderWeeklyChart = (ctx, incomes, expenses, periodMonths) => {
  if (weeklyChartInstance) weeklyChartInstance.destroy();

  const incomeMap = groupByDate(incomes, periodMonths);
  const expenseMap = groupByDate(expenses, periodMonths);
  const labels = Array.from(
    new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)])
  ).sort();

  const periodLabelEl = document.getElementById('chart-period-label');
  if (labels.length > 0) {
    const start = labels[0];
    const end = labels[labels.length - 1];
    periodLabelEl.textContent = formatPeriodLabel(start, end);
  } else {
    periodLabelEl.textContent = '기간 없음';
  }
  const incomeData = labels.map((label) => incomeMap[label] || 0);
  const expenseData = labels.map((label) => expenseMap[label] || 0);

  weeklyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '지출',
          data: expenseData,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 10, // 마우스 인식 범위 확보!
        },
        {
          label: '수입',
          data: incomeData,
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 15, // 마우스 인식 범위 확보!
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
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
        tooltip: {
          mode: 'index', // x축 기준으로 같은 index 데이터 다 보여줌
          intersect: false, // hover 범위 유연하게
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ₩${value.toLocaleString()}`;
            },
          },
        },
        legend: {
          labels: {
            boxWidth: 12,
            boxHeight: 12, // 정사각형 레이블 아이콘
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
