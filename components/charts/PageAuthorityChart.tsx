
import React from 'react';
import { ChartConfiguration } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface PageAuthorityChartProps {
  data: BacklinkEntry[];
}

const PageAuthorityChart: React.FC<PageAuthorityChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.url),
    datasets: [
      {
        label: 'March PA',
        data: data.map(item => item.pageAuthority.mar),
        borderColor: chartColors.mar,
        backgroundColor: chartColors.mar + '4D', // 30% opacity
        pointBackgroundColor: chartColors.mar,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors.mar,
      },
      {
        label: 'June PA',
        data: data.map(item => item.pageAuthority.jun),
        borderColor: chartColors.jun,
        backgroundColor: chartColors.jun + '4D', // 30% opacity
        pointBackgroundColor: chartColors.jun,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors.jun,
      },
    ],
  };

  const config: ChartConfiguration<'radar'> = {
    type: 'radar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: Math.max(...data.map(d => Math.max(d.pageAuthority.mar, d.pageAuthority.jun))) + 5, // Auto-adjust max
          pointLabels: {
            font: {
              size: 9 // Smaller font for point labels if they overlap
            }
          },
           ticks: {
            backdropColor: 'transparent', 
             stepSize: 10
          }
        },
      },
      elements: {
        line: {
          borderWidth: 2
        }
      }
    },
  };

  return <BaseChart config={config} />;
};

export default PageAuthorityChart;