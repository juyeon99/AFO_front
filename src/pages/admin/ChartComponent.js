import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../css/admin/ChartComponent.css';

// Chart.js 설정
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartComponent = ({ title, labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: ['#FF9F40', '#36A2EB', '#FFCD56', '#FF6384', '#4BC0C0'],
        hoverBackgroundColor: ['#FF9F40', '#36A2EB', '#FFCD56', '#FF6384', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <Doughnut data={chartData} />
    </div>
  );
};

export default ChartComponent; 