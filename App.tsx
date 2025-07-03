import React, { useState, useEffect, useMemo } from 'react';
import { BacklinkEntry, RecommendationItem, FindingItem } from './types';
import { backlinkData, recommendationsData } from './constants';
import MetricCard from './components/MetricCard';
import ChartContainer from './components/ChartContainer';
import BacklinkGrowthChart from './components/charts/BacklinkGrowthChart';
import Top3RankingsChart from './components/charts/Top3RankingsChart';
import FirstPageRankingsChart from './components/charts/FirstPageRankingsChart';
import PerformanceTable from './components/PerformanceTable';
import KeywordHighlightList from './components/KeywordHighlightList';


const App: React.FC = () => {
  const [keyFindings, setKeyFindings] = useState<FindingItem[]>([]);

  useEffect(() => {
    // Generate Key Findings
    const findings: FindingItem[] = [];
    const totalBacklinksMar = backlinkData.reduce((sum, item) => sum + item.totalBacklinks.mar, 0);
    const totalBacklinksJun = backlinkData.reduce((sum, item) => sum + item.totalBacklinks.jun, 0);
    const totalBacklinkChange = totalBacklinksJun - totalBacklinksMar;

    findings.push({
        type: totalBacklinkChange >= 0 ? 'success' : 'warning',
        text: `Total backlinks ${totalBacklinkChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(totalBacklinkChange)} across all URLs (from ${totalBacklinksMar} to ${totalBacklinksJun}).`
    });

    const sortedByGrowth = [...backlinkData].sort((a, b) => {
        const growthA = ((a.totalBacklinks.jun - a.totalBacklinks.mar) / Math.max(a.totalBacklinks.mar, 1)) * 100;
        const growthB = ((b.totalBacklinks.jun - b.totalBacklinks.mar) / Math.max(b.totalBacklinks.mar, 1)) * 100;
        return (isFinite(growthB) ? growthB : -Infinity) - (isFinite(growthA) ? growthA : -Infinity);
    });

    if (sortedByGrowth.length > 0 && sortedByGrowth[0].totalBacklinks.mar > 0) {
      findings.push({
          type: 'success',
          text: `Top backlink growth: ${sortedByGrowth[0].url} with ${Math.round(((sortedByGrowth[0].totalBacklinks.jun - sortedByGrowth[0].totalBacklinks.mar) / Math.max(sortedByGrowth[0].totalBacklinks.mar, 1)) * 100)}% increase.`
      });
    } else if (sortedByGrowth.length > 0) {
       findings.push({
          type: 'info',
          text: `Highest backlink addition: ${sortedByGrowth[0].url} gained ${sortedByGrowth[0].totalBacklinks.jun - sortedByGrowth[0].totalBacklinks.mar} backlinks (started from 0).`
      });
    }


    const paDeclines = backlinkData.filter(item => item.pageAuthority.jun < item.pageAuthority.mar);
    if (paDeclines.length > 0) {
        findings.push({
            type: 'warning',
            text: `${paDeclines.length} URLs experienced Page Authority decline: ${paDeclines.map(item => item.url).join(', ')}.`
        });
    } else {
        findings.push({
            type: 'success',
            text: `No URLs experienced a decline in Page Authority. Most maintained or improved.`
        });
    }

    const improvedKeywordNames: string[] = [];
    const declinedKeywordNames: string[] = [];
    const stableKeywordNames: string[] = [];

    backlinkData.forEach(item => {
        Object.entries(item.keywords).forEach(([keywordName, keywordData]) => {
             if (typeof keywordData.mar === 'number' && typeof keywordData.jun === 'number' && !isNaN(keywordData.mar) && !isNaN(keywordData.jun)) {
                if (keywordData.jun < keywordData.mar) {
                    improvedKeywordNames.push(keywordName);
                } else if (keywordData.jun > keywordData.mar) {
                    declinedKeywordNames.push(keywordName);
                } else {
                    stableKeywordNames.push(keywordName);
                }
            }
        });
    });

    findings.push({
        type: improvedKeywordNames.length >= declinedKeywordNames.length ? 'success' : 'warning',
        text: `Keyword ranking summary: ${improvedKeywordNames.length} improved, ${declinedKeywordNames.length} declined, ${stableKeywordNames.length} remained stable.`
    });

    if (improvedKeywordNames.length > 0) {
        findings.push({
            type: 'success',
            text: `Improved Keywords (${improvedKeywordNames.length}): ${improvedKeywordNames.join(', ')}.`
        });
    }
    if (declinedKeywordNames.length > 0) {
        findings.push({
            type: 'warning',
            text: `Declined Keywords (${declinedKeywordNames.length}): ${declinedKeywordNames.join(', ')}.`
        });
    }
    if (stableKeywordNames.length > 0) {
        findings.push({
            type: 'info',
            text: `Stable Keywords (${stableKeywordNames.length}): ${stableKeywordNames.join(', ')}.`
        });
    }
    
    setKeyFindings(findings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount
  
  const totalBacklinksJun = useMemo(() => {
    return backlinkData.reduce((sum, item) => sum + item.totalBacklinks.jun, 0);
  }, []);

  const totalKeywords = useMemo(() => {
    return backlinkData.reduce((sum, item) => sum + Object.keys(item.keywords).length, 0);
  }, []);

  const keywordHighlights = useMemo(() => {
    const top3June: {name: string, pos: number, change: string}[] = [];
    const firstPageJune: {name: string, pos: number, change: string}[] = [];

    backlinkData.forEach(item => {
        Object.entries(item.keywords).forEach(([name, positions]) => {
            const marPos = positions.mar;
            const junPos = positions.jun;
            
            if (!isNaN(marPos) && !isNaN(junPos)) {
                const diff = marPos - junPos;
                let changeStr = '';
                if (diff > 0) {
                    changeStr = `(+${diff})`; // Improved
                } else if (diff < 0) {
                    changeStr = `(${diff})`; // Declined
                } else {
                    changeStr = `(NC)`; // No Change
                }

                if (junPos >= 1 && junPos <= 10) {
                    const entry = { name, pos: junPos, change: changeStr };
                    firstPageJune.push(entry);
                    if (junPos <= 3) {
                        top3June.push(entry);
                    }
                }
            }
        });
    });

    // Sort them by position
    top3June.sort((a, b) => a.pos - b.pos);
    firstPageJune.sort((a, b) => a.pos - b.pos);
    
    return { top3June, firstPageJune };

}, []);

  return (
    <>
      <header className="bg-extra-dark-grey shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold text-white">
              Fortinet Backlink Performance Dashboard
            </h1>
            <div className="text-right">
                <p className="text-gray-200 font-semibold text-sm">Source: GSC, MOZ</p>
                <p className="text-gray-400 text-xs">March 2025 - June 2025</p>
            </div>
        </div>
      </header>

      <main role="main" className="container mx-auto p-4 md:p-8">
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8">
          {/* Key Metrics Overview */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <MetricCard label="URLs Tracked" value={backlinkData.length.toString()} />
            <MetricCard label="Total Backlinks (June)" value={totalBacklinksJun.toString()} />
            <MetricCard label="Keywords Tracked" value={totalKeywords.toString()} />
          </section>

          {/* Charts Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-text-dark mb-6 pb-2 border-b-2 border-primary">Backlink Growth Analysis</h2>
            <div className="mb-8">
              <ChartContainer title="Total Backlinks Growth (Mar-Jun)">
                <BacklinkGrowthChart data={backlinkData} />
              </ChartContainer>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-text-dark mb-6 pb-2 border-b-2 border-primary">Keyword Ranking Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartContainer title="Keywords in Top 3 Positions">
                <Top3RankingsChart data={backlinkData} />
              </ChartContainer>
              <ChartContainer title="Keywords on First Page (Top 10)">
                <FirstPageRankingsChart data={backlinkData} />
              </ChartContainer>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <KeywordHighlightList 
                title="Keywords in Top 3 Positions (June)" 
                icon="🏆"
                keywords={keywordHighlights.top3June} 
              />
              <KeywordHighlightList 
                title="First Page Keywords (June, Pos 4-10)" 
                icon="📄"
                keywords={keywordHighlights.firstPageJune.filter(kw => kw.pos > 3)} 
              />
            </div>
          </section>
          
          {/* Insights and Table Section */}
          <section>
            <h2 className="text-2xl font-semibold text-text-dark mb-6 pb-2 border-b-2 border-primary">Detailed Analysis & Insights</h2>
            
            <div className="bg-light-grey/50 p-6 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold text-text-dark mb-4">Key Findings</h3>
                {keyFindings.map((finding, index) => (
                    <div key={index} className={`p-3 my-2 rounded-md shadow-sm border-l-4 ${
                        finding.type === 'success' ? 'bg-white border-dark-grey' :
                        finding.type === 'warning' ? 'bg-red-tint border-primary' :
                        'bg-white border-medium-grey' // info and neutral
                    }`}>
                        <p className={`${
                            finding.type === 'warning' ? 'text-negative font-medium' : 'text-text-medium'
                        }`}>{finding.text}</p>
                    </div>
                ))}
            </div>

            <div className="bg-light-grey/50 p-6 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold text-text-dark mb-4">Performance Summary Table</h3>
                <PerformanceTable data={backlinkData} />
            </div>

            <div className="bg-light-grey/50 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-text-dark mb-4">Recommendations</h3>
                {recommendationsData.map((rec, index) => (
                    <div key={index} className={`p-3 my-2 rounded-md shadow-sm border-l-4 ${
                        rec.type === 'warning' ? 'bg-red-tint border-primary' :
                        'bg-white border-medium-grey'
                    }`}>
                        <h4 className={`font-semibold text-lg mb-1 ${
                            rec.type === 'warning' ? 'text-negative' : 'text-text-dark'
                        }`}>{rec.title}</h4>
                        <p className="text-text-medium">{rec.content}</p>
                    </div>
                ))}
            </div>
          </section>

          <footer className="text-center mt-12 py-6 border-t border-light-grey">
            <p className="text-text-medium">&copy; {new Date().getFullYear()} Fortinet Inc. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default App;