
import React from 'react';
import { ChartConfiguration } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface BacklinkGrowthChartProps {
  data: BacklinkEntry[];
}

const BacklinkGrowthChart: React.FC<BacklinkGrowthChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.url),
    datasets: [
      {
        label: 'March',
        data: data.map(item => item.totalBacklinks.mar),
        backgroundColor: chartColors.mar,
        borderColor: chartColors.darkMar,
        borderWidth: 1,
      },
      {
        label: 'April',
        data: data.map(item => item.totalBacklinks.apr),
        backgroundColor: chartColors.apr,
        borderColor: chartColors.darkApr,
        borderWidth: 1,
      },
      {
        label: 'May',
        data: data.map(item => item.totalBacklinks.may),
        backgroundColor: chartColors.may,
        borderColor: chartColors.darkMay,
        borderWidth: 1,
      },
      {
        label: 'June',
        data: data.map(item => item.totalBacklinks.jun),
        backgroundColor: chartColors.jun,
        borderColor: chartColors.darkJun,
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
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
             font: {
                size: 10,
            }
          }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Backlinks'
          }
        },
      },
    },
  };

  return <BaseChart config={config} />;
};

export default BacklinkGrowthChart;