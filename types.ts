
export interface MonthlyData {
  mar: number;
  apr: number;
  may: number;
  jun: number;
}

export interface KeywordData {
  [keywordName: string]: MonthlyData;
}

export interface BacklinkEntry {
  url: string; // Short name / identifier for the URL
  fullUrl?: string; // Optional: Full URL if needed for links
  totalBacklinks: MonthlyData;
  backlinkAdded: MonthlyData;
  keywords: KeywordData;
  pageAuthority: MonthlyData;
}

export interface ChartDataBase {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
  fill?: boolean | string;
  pointBackgroundColor?: string;
  hoverBackgroundColor?: string | string[];
}

// For Scatter/Heatmap chart
export interface ScatterPoint {
  x: number;
  y: number;
  v?: number; // Value for color coding or size
  [key: string]: any; // Allow other properties for tooltips
}

export interface ScatterChartDataset extends Omit<ChartDataset, 'data'> {
  data: ScatterPoint[];
  pointRadius?: number | ((context: any) => number);
  
}

export interface RecommendationItem {
  title: string;
  content: string;
  type?: 'success' | 'warning' | 'info';
}

export interface FindingItem {
  text: string;
  type: 'success' | 'warning' | 'info' | 'neutral';
}