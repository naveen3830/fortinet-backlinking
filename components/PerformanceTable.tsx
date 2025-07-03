import React from 'react';
import { BacklinkEntry } from '../types';

interface PerformanceTableProps {
  data: BacklinkEntry[];
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-extra-dark-grey text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">URL</th>
            <th className="py-3 px-4 text-left font-semibold">Backlink Growth (Mar-Jun)</th>
            <th className="py-3 px-4 text-left font-semibold">PA Change (Mar-Jun)</th>
            <th className="py-3 px-4 text-left font-semibold">Best Keyword Move</th>
            <th className="py-3 px-4 text-left font-semibold">Worst Keyword Move</th>
            <th className="py-3 px-4 text-left font-semibold">Overall Status</th>
          </tr>
        </thead>
        <tbody className="text-text-medium">
          {data.map((item, index) => {
            const backlinkGrowth = item.totalBacklinks.jun - item.totalBacklinks.mar;
            const paChange = item.pageAuthority.jun - item.pageAuthority.mar;

            let bestKeyword = { name: 'N/A', improvement: 0 };
            let worstKeyword = { name: 'N/A', decline: 0 };

            Object.entries(item.keywords).forEach(([name, positions]) => {
                if (typeof positions.mar === 'number' && typeof positions.jun === 'number' && !isNaN(positions.mar) && !isNaN(positions.jun)) {
                    const change = positions.mar - positions.jun; // Positive is improvement
                    if (change > bestKeyword.improvement) {
                        bestKeyword = { name, improvement: change };
                    }
                    if (change < worstKeyword.decline) {
                        worstKeyword = { name, decline: change };
                    }
                }
            });
            
            const hasDeclinedKeywords = worstKeyword.decline < 0;

            let overallStatus: 'Good' | 'Fair' | 'Needs Attention' = 'Fair';
            let statusColor = 'bg-light-grey text-medium-grey';

            if (backlinkGrowth > 0 && paChange >= 0 && !hasDeclinedKeywords) {
                overallStatus = 'Good';
                statusColor = 'bg-gray-200 text-dark-grey';
            } else if (backlinkGrowth < 0 || paChange < 0 || hasDeclinedKeywords) {
                overallStatus = 'Needs Attention';
                statusColor = 'bg-red-tint text-primary';
            }


            return (
              <tr key={item.url} className={`border-b border-light-grey ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-light-grey/50 transition-colors`}>
                <td className="py-3 px-4 whitespace-nowrap">
                  <a href={item.fullUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    {item.url}
                  </a>
                </td>
                <td className={`py-3 px-4 font-medium ${backlinkGrowth > 0 ? 'text-positive' : backlinkGrowth < 0 ? 'text-negative' : 'text-neutral'}`}>
                  {backlinkGrowth > 0 ? '↑' : backlinkGrowth < 0 ? '↓' : ''} {Math.abs(backlinkGrowth)}
                </td>
                <td className={`py-3 px-4 font-medium ${paChange > 0 ? 'text-positive' : paChange < 0 ? 'text-negative' : 'text-neutral'}`}>
                  {paChange > 0 ? '↑' : paChange < 0 ? '↓' : ''} {Math.abs(paChange)}
                </td>
                <td className={`py-3 px-4 ${bestKeyword.improvement > 0 ? 'text-positive' : 'text-neutral'}`}>
                  {bestKeyword.improvement > 0
                    ? `${bestKeyword.name} (+${bestKeyword.improvement})`
                    : '–'}
                </td>
                 <td className={`py-3 px-4 ${worstKeyword.decline < 0 ? 'text-negative' : 'text-neutral'}`}>
                   {worstKeyword.decline < 0
                    ? `${worstKeyword.name} (${worstKeyword.decline})`
                    : '–'}
                </td>
                <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                        {overallStatus}
                    </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;