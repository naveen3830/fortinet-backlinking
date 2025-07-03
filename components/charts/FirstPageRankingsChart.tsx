
import React from 'react';
import { ChartConfiguration } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface FirstPageRankingsChartProps {
  data: BacklinkEntry[];
}

const FirstPageRankingsChart: React.FC<FirstPageRankingsChartProps> = ({ data }) => {
  let firstPageMar = 0;
  let firstPageJun = 0;

  data.forEach(item => {
    Object.values(item.keywords).forEach(keyword => {
      if (keyword.mar >= 1 && keyword.mar <= 10) firstPageMar++;
      if (keyword.jun >= 1 && keyword.jun <= 10) firstPageJun++;
    });
  });

  const chartData = {
    labels: ['March 2025', 'June 2025'],
    datasets: [
      {
        label: 'Keywords on First Page (Top 10)',
        data: [firstPageMar, firstPageJun],
        backgroundColor: [chartColors.mar, chartColors.jun],
        borderColor: [chartColors.darkMar, chartColors.darkJun],
        borderWidth: 1,
      },
    ],
  };

  const config: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Keywords',
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  };

  return <BaseChart config={config} />;
};

export default FirstPageRankingsChart;