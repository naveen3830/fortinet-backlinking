
import React from 'react';
import { ChartConfiguration, Chart } from 'chart.js';
import { BacklinkEntry } from '../../types';
import BaseChart from './BaseChart';
import { chartColors } from '../../constants';

interface KeywordMovementChartProps {
  data: BacklinkEntry[];
}

// Re-purposed to be a Dumbbell/Slope chart for keyword ranking movement
const KeywordHeatmapChart: React.FC<KeywordMovementChartProps> = ({ data }) => {
  const keywordPerformance: {
    keywordName: string;
    urlName: string;
    marPos: number;
    junPos: number;
  }[] = [];

  data.forEach((item) => {
    Object.entries(item.keywords).forEach(([keyword, positions]) => {
      if (typeof positions.mar === 'number' && typeof positions.jun === 'number' && !isNaN(positions.mar) && !isNaN(positions.jun)) {
        keywordPerformance.push({
          keywordName: keyword,
          urlName: item.url,
          marPos: positions.mar,
          junPos: positions.jun,
        });
      }
    });
  });

  // Sort by the keyword that had the biggest improvement to show at the top
  keywordPerformance.sort((a, b) => (a.marPos - a.junPos) - (b.marPos - b.junPos));

  const chartLabels = keywordPerformance.map(d => `${d.keywordName}`);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'March',
        data: keywordPerformance.map(d => d.marPos > 100 ? 101 : d.marPos),
        pointBackgroundColor: chartColors.mar,
        borderColor: 'transparent', // We don't want the line connecting points within the dataset
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'June',
        data: keywordPerformance.map(d => d.junPos > 100 ? 101 : d.junPos),
        pointBackgroundColor: chartColors.jun,
        borderColor: 'transparent',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const dumbbellPlugin = {
    id: 'dumbbell',
    afterDatasetsDraw: (chart: Chart) => {
      const { ctx } = chart;
      const marchMeta = chart.getDatasetMeta(0);
      const juneMeta = chart.getDatasetMeta(1);

      ctx.save();
      ctx.lineWidth = 2.5;

      for (let i = 0; i < marchMeta.data.length; i++) {
        const marchPoint = marchMeta.data[i];
        const junePoint = juneMeta.data[i];
        
        const marPos = keywordPerformance[i].marPos;
        const junPos = keywordPerformance[i].junPos;
        
        let strokeColor = chartColors.neutral; // No change
        if (junPos < marPos) {
          strokeColor = chartColors.positive; // Improvement
        } else if (junPos > marPos) {
          strokeColor = chartColors.negative; // Decline
        }

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.moveTo(marchPoint.x, marchPoint.y);
        ctx.lineTo(junePoint.x, junePoint.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: chartData,
    plugins: [dumbbellPlugin],
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
            tension: 0, // Makes lines straight
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'y', // This will group tooltips by the y-axis label
          intersect: false,
          callbacks: {
            title: (tooltipItems) => {
              const index = tooltipItems[0].dataIndex;
              const point = keywordPerformance[index];
              return `${point.keywordName} (${point.urlName})`;
            },
            label: (context) => {
              const datasetLabel = context.dataset.label || '';
              const value = context.parsed.x;
              let rankText = `Rank ${value}`;
              if(value > 100) rankText = 'Rank >100';
              return `${datasetLabel}: ${rankText}`;
            },
          },
        },
      },
      scales: {
        x: {
          position: 'bottom',
          title: { display: true, text: 'Ranking Position (Lower is Better)' },
          min: 1,
          max: 102,
        },
        y: {
          ticks: {
             font: { size: 10 },
             autoSkip: false
          },
          grid: {
            display: true,
            color: '#eee'
          }
        },
      },
    },
  };

  return <BaseChart config={config} />;
};

export default KeywordHeatmapChart;
