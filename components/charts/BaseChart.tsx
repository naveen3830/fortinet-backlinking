
import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';

// Register all controllers, elements, scales, and plugins
// Chart.register(...registerables); // Not needed if using CDN which globally registers

interface BaseChartProps<TType extends keyof ChartTypeRegistry = keyof ChartTypeRegistry> {
  config: ChartConfiguration<TType>;
  className?: string;
}

const BaseChart = <TType extends keyof ChartTypeRegistry,>({ config, className }: BaseChartProps<TType>): React.ReactElement => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<TType> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart<TType>(ctx, config);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [config]);

  return <canvas ref={chartRef} className={className}></canvas>;
};

export default BaseChart;
