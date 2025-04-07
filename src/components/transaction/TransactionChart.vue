<template>
  <div class="card border p-4 rounded-4 shadow-sm bg-white h-100">
    <h5 class="fw-semibold mb-4">기간별 비교</h5>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = {
  labels: ["4개월 전", "3개월 전", "2개월 전", "1개월 전", "이번 달"],
  datasets: [
    {
      label: "수입",
      backgroundColor: "#3B82F6",
      borderRadius: 8,
      data: [2000000, 2100000, 1800000, 2200000, 3500000],
      barThickness: 10,
      categoryPercentage: 0.6,
      barPercentage: 0.8,
    },
    {
      label: "지출",
      backgroundColor: "#EF4444",
      borderRadius: 8,
      data: [1500000, 1900000, 1700000, 2000000, 2500000],
      barThickness: 10,
      categoryPercentage: 0.6,
      barPercentage: 0.8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 3,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1000000,
        callback: (value) => `${(value / 10000).toLocaleString()}만원`,
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 16,
      },
    },
  },
};
</script>

<style scoped>
.card {
  height: 300px;
}
</style>
