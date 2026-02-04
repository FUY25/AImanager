import { mockApiUsage, mockUsageTimeline } from '../data/mockData';
import { TrendUp, WarningCircle } from '@phosphor-icons/react';

export default function ApiView() {
  const totalCost = mockApiUsage.reduce((sum, usage) => sum + usage.cost, 0);
  const budget = 500;
  const budgetUsed = (totalCost / budget) * 100;
  const totalRequests = mockApiUsage.reduce((sum, usage) => sum + usage.requests, 0);
  const totalTokens = mockApiUsage.reduce((sum, usage) => sum + usage.totalTokens, 0);
  const weightedSuccessRate = totalRequests
    ? mockApiUsage.reduce((sum, usage) => sum + usage.requests * usage.successRate, 0) /
      totalRequests
    : 0;
  const weightedLatency = totalRequests
    ? mockApiUsage.reduce((sum, usage) => sum + usage.requests * usage.avgLatency, 0) /
      totalRequests
    : 0;

  const totalByDay = mockUsageTimeline.map(day => day.claude + day.gemini + day.codex);
  const maxTotal = Math.max(...totalByDay, 1);
  const chartWidth = 560;
  const chartHeight = 160;
  const chartPadding = 18;
  const chartStep =
    totalByDay.length > 1
      ? (chartWidth - chartPadding * 2) / (totalByDay.length - 1)
      : 0;
  const toPoints = (values: number[], maxValue: number) =>
    values
      .map((value, index) => {
        const x = chartPadding + chartStep * index;
        const y =
          chartPadding +
          (chartHeight - chartPadding * 2) * (1 - value / Math.max(maxValue, 1));
        return `${x},${y}`;
      })
      .join(' ');
  const totalPoints = toPoints(totalByDay, maxTotal);
  const claudePoints = toPoints(
    mockUsageTimeline.map(day => day.claude),
    maxTotal
  );

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">API Usage Ledger</h2>
          <div className="text-sm text-text-tertiary mt-1">
            A focused operations view of spend, stability, and throughput.
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select className="px-3 py-2 text-xs border border-border rounded-md bg-bg-elevated text-text-secondary">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <button className="px-3.5 py-2 text-xs bg-bg-tertiary hover:bg-bg-secondary text-text-primary rounded-md transition-colors border border-border">
            Export
          </button>
          <button className="px-3.5 py-2 text-xs bg-brand hover:bg-brand/90 text-white rounded-md transition-colors">
            Set Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Budget Window
              </h3>
              <span className="text-xs text-text-tertiary">${budget}/month</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-text-tertiary">Total spend</span>
                <span className="text-lg font-semibold text-text-primary">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 bg-primary-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all"
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                <span className="px-2 py-1 bg-bg-tertiary border border-border rounded-full">
                  {budgetUsed.toFixed(0)}% used
                </span>
                <span className="px-2 py-1 bg-bg-tertiary border border-border rounded-full">
                  ${(budget - totalCost).toFixed(0)} left
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <TrendUp size={14} className="text-success" />
                <span>Trend: +15% vs last week</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
              Service Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-text-tertiary mb-1">Success rate</div>
                <div className="text-lg font-semibold text-success">
                  {weightedSuccessRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Avg latency</div>
                <div className="text-lg font-semibold text-text-primary">
                  {weightedLatency.toFixed(2)}s
                </div>
              </div>
              <div className="text-xs text-text-tertiary">
                Peak usage 2-4 PM · Requests {totalRequests.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
              Alert Rules
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
              <span className="px-2 py-1 bg-bg-tertiary border border-border rounded-full">
                Cost &gt; 85%
              </span>
              <span className="px-2 py-1 bg-bg-tertiary border border-border rounded-full">
                Latency &gt; 2s
              </span>
              <span className="px-2 py-1 bg-bg-tertiary border border-border rounded-full">
                Errors &gt; 2%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Usage Pulse
              </h3>
              <span className="text-xs text-text-tertiary">Last 7 days</span>
            </div>
            <div className="text-xs text-text-tertiary">
              Total requests with Claude overlay.
            </div>
            <div className="mt-4 bg-bg-tertiary border border-border rounded-md p-3">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                width="100%"
                height="170"
                role="img"
                aria-label="Usage timeline"
              >
                <polyline
                  fill="none"
                  stroke="#33465d"
                  strokeWidth="3"
                  points={totalPoints}
                />
                <polyline
                  fill="none"
                  stroke="#2f7d4b"
                  strokeWidth="3"
                  points={claudePoints}
                />
                <line
                  x1={chartPadding}
                  y1={chartHeight - chartPadding}
                  x2={chartWidth - chartPadding}
                  y2={chartHeight - chartPadding}
                  stroke="#d8d3cd"
                  strokeWidth="2"
                />
              </svg>
              <div className="flex items-center justify-between text-xs text-text-tertiary mt-2">
                {mockUsageTimeline.map(day => (
                  <span key={day.date}>{day.date}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Model Mix
              </h3>
              <span className="text-xs text-text-tertiary">
                {totalTokens > 0 ? `${(totalTokens / 1000000).toFixed(1)}M tokens` : 'No usage'}
              </span>
            </div>
            <div className="space-y-3">
              {mockApiUsage
                .filter(usage => usage.requests > 0)
                .map(usage => {
                  const share = totalCost > 0 ? (usage.cost / totalCost) * 100 : 0;
                  return (
                    <div key={usage.modelId} className="text-xs text-text-secondary">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-text-primary">{usage.modelName}</span>
                        <span>{share.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-primary-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-4 text-xs text-text-tertiary">
              Weighted latency {weightedLatency.toFixed(2)}s · {totalRequests.toLocaleString()} requests
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2 2xl:col-span-1">
          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3 px-3">
              Error Stream
            </h3>
            <div className="space-y-2">
              {mockApiUsage
                .flatMap(usage => usage.errors)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((error, index) => {
                  const hoursAgo = Math.floor(
                    (Date.now() - error.timestamp.getTime()) / (1000 * 60 * 60)
                  );
                  const errorColors = {
                    'Rate Limit': 'text-error',
                    Timeout: 'text-text-secondary',
                    Authentication: 'text-error',
                  };
                  return (
                    <div
                      key={index}
                      className="bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-text-tertiary">
                        <span>{hoursAgo}h ago</span>
                        <span className={errorColors[error.errorType as keyof typeof errorColors]}>
                          {error.errorType}
                        </span>
                      </div>
                      <div className="text-text-primary mt-1">{error.message}</div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
              Latency Watch
            </h3>
            <div className="flex items-center justify-between text-xs text-text-tertiary mb-2">
              <span>Current</span>
              <span>SLO 2.0s</span>
            </div>
            <div className="text-lg font-semibold text-text-primary">
              {weightedLatency.toFixed(2)}s
            </div>
            <div className="w-full h-2 bg-primary-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-brand"
                style={{ width: `${Math.min((weightedLatency / 2) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-text-tertiary">
              P95 estimate {(weightedLatency * 1.2).toFixed(2)}s
            </div>
          </div>

          <div className="bg-primary-100 border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2 uppercase tracking-wide">
              <WarningCircle size={16} className="text-text-secondary" />
              Recommendations
            </h3>
            <div className="space-y-2 text-xs text-text-secondary">
              <div>Shift burst traffic to Gemini between 2-4 PM.</div>
              <div>Add an alert at 80% budget utilization.</div>
              <div>Increase retry cap for Claude batch runs.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
