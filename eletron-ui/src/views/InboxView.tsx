import { mockTasks, mockAgents } from '../data/mockData';
import { WarningCircle, GitDiff, Clock, CheckCircle } from '@phosphor-icons/react';
import Avatar from '../components/Avatar';
import { RiskFlag } from '../types';

const riskLabel: Record<RiskFlag, string> = {
  stuck: 'Stuck',
  failing: 'Failing',
  needs_review: 'Needs review',
};

const riskStyle: Record<RiskFlag, string> = {
  stuck: 'bg-primary-200 text-text-primary',
  failing: 'bg-primary-200 text-error',
  needs_review: 'bg-primary-100 text-text-secondary',
};

const getAgent = (agentId: string | null) => {
  if (!agentId) return null;
  return mockAgents.find(agent => agent.id === agentId) || null;
};

const getReviewItem = (changedFiles: string[], title: string) => {
  if (changedFiles.length > 0) {
    const file = changedFiles[0].split('/').slice(-1)[0];
    return file;
  }
  return title;
};

const getBlockedSummary = (task: typeof mockTasks[number]) => {
  if (task.status === 'blocked' && task.dependencies.length > 0) {
    const deps = task.dependencies.map(dep => dep.split('-')[1]).join(', ');
    return `Blocked by #${deps}`;
  }
  if (task.riskFlags.length > 0) {
    const flags = task.riskFlags.map(flag => riskLabel[flag]).join(', ');
    return `Risk: ${flags}`;
  }
  if (task.changedFiles.length > 0) {
    return `Pending review of ${task.changedFiles[0].split('/').slice(-1)[0]}`;
  }
  return 'Needs clarification';
};

export default function InboxView() {
  const reviewQueue = mockTasks.filter(task => task.riskFlags.includes('needs_review'));
  const blockedQueue = mockTasks.filter(task => task.status === 'blocked');

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Inbox</h2>
        </div>
        <button className="text-xs px-3 py-1.5 border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary">
          Mark all reviewed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-elevated border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-text-tertiary" />
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                Needs Review
              </h3>
            </div>
            <span className="text-xs text-text-tertiary">{reviewQueue.length} items</span>
          </div>
          <div className="space-y-3">
            {reviewQueue.map(task => {
              const agent = getAgent(task.assignedTo);
              return (
                <div
                  key={task.id}
                  className="border border-border rounded-md p-3 bg-bg-tertiary text-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={agent?.avatar}
                        alt={agent?.name}
                        fallback={agent?.name?.[0] || 'U'}
                        className="w-11 h-11 rounded-full shadow-[0_10px_18px_rgba(40,35,28,0.16)]"
                        textClassName="text-sm"
                        ring
                        presence={Boolean(agent)}
                        presenceStatus={agent?.status || 'idle'}
                      />
                      <div className="text-sm font-semibold text-text-primary">
                        Needs review: {getReviewItem(task.changedFiles, task.title)}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-primary-100 text-text-secondary">
                      {riskLabel.needs_review}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-text-tertiary">
                    <div className="flex items-center gap-1">
                      <GitDiff size={12} />
                      {task.changedFiles.length} files
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      Updated {task.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-bg-elevated border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <WarningCircle size={16} className="text-text-tertiary" />
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                Blocked & At Risk
              </h3>
            </div>
            <span className="text-xs text-text-tertiary">{blockedQueue.length} items</span>
          </div>
          <div className="space-y-3">
            {blockedQueue.map(task => {
              const agent = getAgent(task.assignedTo);
              return (
                <div
                  key={task.id}
                  className="border border-border rounded-md p-3 bg-bg-tertiary text-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={agent?.avatar}
                        alt={agent?.name}
                        fallback={agent?.name?.[0] || 'U'}
                        className="w-11 h-11 rounded-full shadow-[0_10px_18px_rgba(40,35,28,0.16)]"
                        textClassName="text-sm"
                        ring
                        presence={Boolean(agent)}
                        presenceStatus={agent?.status || 'idle'}
                      />
                      <div>
                        <div className="text-sm font-semibold text-text-primary">
                          {task.title}
                        </div>
                        <div className="text-xs text-text-tertiary mt-1">
                          {getBlockedSummary(task)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {task.riskFlags.map(flag => (
                        <span
                          key={flag}
                          className={`text-xs px-2 py-0.5 rounded-full border border-border ${riskStyle[flag]}`}
                        >
                          {riskLabel[flag]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-text-tertiary">
                    <div className="flex items-center gap-1">
                      <GitDiff size={12} />
                      {task.changedFiles.length} files
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      Updated {task.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
