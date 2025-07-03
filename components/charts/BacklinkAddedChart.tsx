
import React from 'react';
import { ChartConfiguration } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface BacklinkAddedChartProps {
  data: BacklinkEntry[];
}

const BacklinkAddedChart: React.FC<BacklinkAddedChartProps> = ({ data }) => {
  // Show top 6 by June backlinks added, or all if less than 6
  const sortedData = [...data].sort((a,b) => b.backlinkAdded.jun - a.backlinkAdded.jun);
  const displayData = sortedData.slice(0, Math.min(6, data.length));


  const chartData = {
    labels: ['March', 'April', 'May', 'June'],
    datasets: displayData.map((item, index) => ({
      label: item.url,
      data: [item.backlinkAdded.mar, item.backlinkAdded.apr, item.backlinkAdded.may, item.backlinkAdded.jun],
      borderColor: chartColors.palette[index % chartColors.palette.length],
      backgroundColor: chartColors.palette[index % chartColors.palette.length] + '33', // Add alpha for area fill
      tension: 0.3,
      fill: false, // Set to true if you want area charts
    })),
  };

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
           labels: {
                font: { size: 10 }
            }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Backlinks Added'
          }
        },
         x: {
            ticks: {
                 font: { size: 10 }
            }
        }
      },
    },
  };

  return <BaseChart config={config} />;
};

export default BacklinkAddedChart;