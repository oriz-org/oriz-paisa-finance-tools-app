/**
 * FinSuite OS - Smart Chart Component
 * Chart.js wrapper with gradient fills and glass tooltips
 */

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartConfiguration,
  type ChartData,
  type ChartOptions,
} from 'chart.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Theme colors
const COLORS = {
  growth: '#34C759',
  growthLight: 'rgba(52, 199, 89, 0.2)',
  cost: '#FF3B30',
  costLight: 'rgba(255, 59, 48, 0.2)',
  primary: '#00d4ff',
  primaryLight: 'rgba(0, 212, 255, 0.2)',
  secondary: '#7c3aed',
  secondaryLight: 'rgba(124, 58, 237, 0.2)',
  neutral: '#6b7280',
  neutralLight: 'rgba(107, 114, 128, 0.2)',
  text: 'rgba(255, 255, 255, 0.7)',
  grid: 'rgba(255, 255, 255, 0.1)',
};

/**
 * Create a gradient for chart fills
 */
function createGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  colorLight: string
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, colorLight);
  return gradient;
}

/**
 * Default chart options with glass theme
 */
const defaultOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300,
    easing: 'easeOutQuart',
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: COLORS.text,
        font: {
          family: 'Inter, sans-serif',
          size: 12,
        },
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: COLORS.text,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context) => {
          const value = context.parsed.y ?? context.parsed;
          if (typeof value === 'number') {
            return `${context.dataset.label}: ₹${value.toLocaleString('en-IN')}`;
          }
          return `${context.dataset.label}: ${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: COLORS.grid,
      },
      ticks: {
        color: COLORS.text,
        font: {
          family: 'Inter, sans-serif',
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: COLORS.grid,
      },
      ticks: {
        color: COLORS.text,
        font: {
          family: 'JetBrains Mono, monospace',
          size: 11,
        },
        callback: (value) => {
          if (typeof value === 'number') {
            if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
            if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
            if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
            return `₹${value}`;
          }
          return value;
        },
      },
    },
  },
};

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area';

export interface ChartDataset {
  label: string;
  data: number[];
  type?: 'growth' | 'cost' | 'primary' | 'secondary' | 'neutral';
  fill?: boolean;
}

export interface SmartChartConfig {
  type: ChartType;
  labels: string[];
  datasets: ChartDataset[];
  title?: string;
  showLegend?: boolean;
  currency?: boolean;
}

/**
 * Smart Chart Manager
 * Creates and manages Chart.js instances with automatic updates
 */
export class SmartChart {
  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');
    this.ctx = ctx;
  }

  /**
   * Render or update the chart
   */
  render(config: SmartChartConfig): void {
    const { type, labels, datasets, title, showLegend = true, currency = true } = config;

    // Prepare datasets with gradients
    const chartDatasets = datasets.map((ds) => {
      const colorKey = ds.type || 'primary';
      const color = COLORS[colorKey];
      const colorLight = COLORS[`${colorKey}Light` as keyof typeof COLORS] || COLORS.primaryLight;

      const baseConfig = {
        label: ds.label,
        data: ds.data,
        borderColor: color,
        backgroundColor:
          type === 'line' || type === 'area'
            ? createGradient(this.ctx, color, colorLight)
            : type === 'pie' || type === 'doughnut'
            ? datasets.map((_, i) => {
                const colors = [COLORS.growth, COLORS.neutral, COLORS.primary, COLORS.secondary, COLORS.cost];
                return colors[i % colors.length];
              })
            : color,
        borderWidth: 2,
        fill: ds.fill ?? (type === 'area'),
        tension: 0.4,
        pointRadius: type === 'line' || type === 'area' ? 0 : undefined,
        pointHoverRadius: type === 'line' || type === 'area' ? 6 : undefined,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      };

      return baseConfig;
    });

    const chartType = type === 'area' ? 'line' : type;

    const chartConfig: ChartConfiguration = {
      type: chartType,
      data: {
        labels,
        datasets: chartDatasets,
      } as ChartData,
      options: {
        ...defaultOptions,
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            ...defaultOptions.plugins?.legend,
            display: showLegend,
          },
          title: title
            ? {
                display: true,
                text: title,
                color: '#fff',
                font: {
                  family: 'Inter, sans-serif',
                  size: 14,
                  weight: 600,
                },
                padding: { bottom: 16 },
              }
            : { display: false },
          tooltip: {
            ...defaultOptions.plugins?.tooltip,
            callbacks: currency
              ? {
                  label: (context) => {
                    const value = context.parsed.y ?? context.parsed;
                    if (typeof value === 'number') {
                      return `${context.dataset.label}: ₹${value.toLocaleString('en-IN')}`;
                    }
                    return `${context.dataset.label}: ${value}`;
                  },
                }
              : undefined,
          },
        },
        scales:
          type === 'pie' || type === 'doughnut'
            ? undefined
            : defaultOptions.scales,
      } as ChartOptions,
    };

    // Update or create chart
    if (this.chart) {
      this.chart.data.labels = chartConfig.data?.labels;
      this.chart.data.datasets = chartConfig.data?.datasets || [];
      // Safely update options without losing object reference if possible, or just merge
      if (chartConfig.options) {
        Object.assign(this.chart.options, chartConfig.options);
      }
      this.chart.update('none');
    } else {
      this.chart = new Chart(this.canvas, chartConfig);
    }
  }

  /**
   * Update chart data without full re-render
   */
  updateData(datasets: ChartDataset[]): void {
    if (!this.chart) return;

    datasets.forEach((ds, i) => {
      if (this.chart!.data.datasets[i]) {
        this.chart!.data.datasets[i].data = ds.data;
      }
    });

    this.chart.update('none');
  }

  /**
   * Destroy the chart instance
   */
  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

/**
 * Create a growth vs invested chart
 */
export function createGrowthChart(
  canvas: HTMLCanvasElement,
  labels: string[],
  invested: number[],
  totalValue: number[]
): SmartChart {
  const chart = new SmartChart(canvas);
  chart.render({
    type: 'area',
    labels,
    datasets: [
      { label: 'Total Value', data: totalValue, type: 'growth', fill: true },
      { label: 'Amount Invested', data: invested, type: 'neutral', fill: true },
    ],
  });
  return chart;
}

/**
 * Create a pie chart for breakdown
 */
export function createBreakdownPie(
  canvas: HTMLCanvasElement,
  principal: number,
  interest: number
): SmartChart {
  const chart = new SmartChart(canvas);
  chart.render({
    type: 'doughnut',
    labels: ['Principal', 'Interest/Gains'],
    datasets: [{ label: 'Amount', data: [principal, interest] }],
    showLegend: true,
  });
  return chart;
}
