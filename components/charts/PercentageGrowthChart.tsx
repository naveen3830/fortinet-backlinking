
import React from 'react';
import { ChartConfiguration, TooltipItem } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface PercentageGrowthChartProps {
  data: BacklinkEntry[];
}

const PercentageGrowthChart: React.FC<PercentageGrowthChartProps> = ({ data }) => {
  const growthData = data.map(item => {
    if (item.totalBacklinks.mar === 0 && item.totalBacklinks.jun > 0) return 100; // Consider growth from 0 to N as 100% for this viz
    if (item.totalBacklinks.mar === 0 && item.totalBacklinks.jun === 0) return 0;
    // Ensure mar is not zero to prevent division by zero, though covered by above.
    // If mar is negative or invalid, this could also be an issue, but data seems positive.
    if (item.totalBacklinks.mar <= 0) return 0; // Or handle as appropriate
    return ((item.totalBacklinks.jun - item.totalBacklinks.mar) / item.totalBacklinks.mar) * 100;
  }).filter(value => isFinite(value)); // Filter out NaN/Infinity

  const labels = data.map(item => item.url);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: growthData,
        backgroundColor: growthData.map((_, index) => chartColors.palette[index % chartColors.palette.length]),
        hoverOffset: 4,
      },
    ],
  };

  const config: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
           labels: {
            boxWidth: 20,
            font: {
                size: 10
            },
            generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels && data.datasets) {
                    return data.labels.map((label, i) => {
                        const meta = chart.getDatasetMeta(0);
                        const style = meta.controller.getStyle(i, false) as any; // Cast to any if specific style type is unknown or complex
                        const value = data.datasets[0].data[i] as number;
                        return {
                            text: `${label}: ${value !== undefined && !isNaN(value) ? Math.round(value) : 'N/A'}%`,
                            fillStyle: style.backgroundColor,
                            strokeStyle: style.borderColor,
                            lineWidth: style.borderWidth,
                            hidden: isNaN(value) || value === undefined, // Hide if NaN or undefined
                            index: i
                        };
                    });
                }
                return [];
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context: TooltipItem<'doughnut'>) {
              let tooltipLabel = context.label || '';
              if (tooltipLabel) {
                tooltipLabel += ': ';
              }
              
              if (typeof context.parsed === 'number' && !isNaN(context.parsed)) {
                tooltipLabel += context.parsed.toFixed(2) + '%';
              } else if (typeof context.raw === 'number' && !isNaN(context.raw)) {
                 tooltipLabel += context.raw.toFixed(2) + '%';
              } else {
                tooltipLabel += 'N/A';
              }
              return tooltipLabel;
            },
          },
        },
      },
    },
  };

  return <BaseChart config={config} />;
};

export default PercentageGrowthChart;