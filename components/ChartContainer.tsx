
import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-light-grey">
      <h3 className="text-lg font-semibold text-text-dark mb-4 text-center">{title}</h3>
      <div className="relative h-72 md:h-96"> {/* Ensure canvas has a defined height */}
         {children}
      </div>
    </div>
  );
};

export default ChartContainer;