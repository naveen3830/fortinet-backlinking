import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary transition-shadow hover:shadow-lg">
      <div className="text-4xl font-bold text-text-dark mb-2">{value}</div>
      <div className="text-sm text-text-medium uppercase tracking-wider">{label}</div>
    </div>
  );
};

export default MetricCard;