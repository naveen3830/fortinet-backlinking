
import React from 'react';

interface KeywordHighlight {
  name: string;
  pos: number;
  change: string;
}

interface KeywordHighlightListProps {
  title: string;
  keywords: KeywordHighlight[];
  icon: string;
}

const KeywordHighlightList: React.FC<KeywordHighlightListProps> = ({ title, keywords, icon }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-light-grey h-full">
      <h3 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        {title}
      </h3>
      {keywords.length > 0 ? (
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {keywords.map((kw, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md hover:bg-light-grey/50 transition-colors">
              <span className="text-text-medium font-medium truncate pr-2" title={kw.name}>{kw.name}</span>
              <div className="flex items-center space-x-3 flex-shrink-0">
                 <span className={`text-xs font-bold w-12 text-center ${kw.change.includes('+') ? 'text-positive' : kw.change.includes('-') ? 'text-negative' : 'text-neutral'}`}>
                  {kw.change}
                </span>
                <span className="bg-primary text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow">
                  {kw.pos}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-48 rounded-md bg-light-grey/50">
             <p className="text-text-light italic">No keywords in this category for June.</p>
        </div>
      )}
    </div>
  );
};

export default KeywordHighlightList;