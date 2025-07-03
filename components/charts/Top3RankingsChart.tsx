
import React from 'react';
import { ChartConfiguration } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface Top3RankingsChartProps {
  data: BacklinkEntry[];
}

const Top3RankingsChart: React.FC<Top3RankingsChartProps> = ({ data }) => {
  let top3Mar = 0;
  let top3Jun = 0;

  data.forEach(item => {
    Object.values(item.keywords).forEach(keyword => {
      if (keyword.mar >= 1 && keyword.mar <= 3) top3Mar++;
      if (keyword.jun >= 1 && keyword.jun <= 3) top3Jun++;
    });
  });

  const chartData = {
    labels: ['March 2025', 'June 2025'],
    datasets: [
      {
        label: 'Keywords in Top 3',
        data: [top3Mar, top3Jun],
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
          display: false, // Or position: 'top' if preferred
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Keywords'
          },
          ticks: {
            stepSize: 1, // Ensure integer ticks
          },
        },
      },
    },
  };

  return <BaseChart config={config} />;
};

export default Top3RankingsChart;