import { Fragment, useState } from 'react';
import { mockTasks, mockAgents } from '../data/mockData';
import { Task, Agent, RiskFlag, TaskStatus } from '../types';
import Avatar from '../components/Avatar';
import {
  CaretDown,
  CaretRight,
  GitDiff,
  ArrowSquareOut,
} from '@phosphor-icons/react';

const statusMeta: Record<
  TaskStatus,
  { label: string; dot: string; text: string }
> = {
  todo: {
    label: 'To do',
    dot: 'bg-primary-300 shadow-[0_0_0_4px_rgba(154,152,146,0.15)]',
    text: 'text-text-tertiary',
  },
  in_progress: {
    label: 'In progress',
    dot: 'bg-brand shadow-[0_0_0_4px_rgba(47,65,86,0.15)]',
    text: 'text-accent-700',
  },
  review: {
    label: 'Review',
    dot: 'bg-accent-500 shadow-[0_0_0_4px_rgba(74,127,224,0.16)]',
    text: 'text-accent-700',
  },
  done: {
    label: 'Done',
    dot: 'bg-success shadow-[0_0_0_4px_rgba(47,125,75,0.15)]',
    text: 'text-success',
  },
  blocked: {
    label: 'Blocked',
    dot: 'bg-error shadow-[0_0_0_4px_rgba(193,70,63,0.12)]',
    text: 'text-error',
  },
  canceled: {
    label: 'Canceled',
    dot: 'bg-primary-400 shadow-[0_0_0_4px_rgba(154,152,146,0.2)]',
    text: 'text-text-secondary',
  },
};

const getStatusMeta = (status: TaskStatus) => statusMeta[status];

export default function TableView() {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(
    new Set(mockAgents.map(a => a.id))
  );

  const toggleAgent = (agentId: string) => {
    const newExpanded = new Set(expandedAgents);
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId);
    } else {
      newExpanded.add(agentId);
    }
    setExpandedAgents(newExpanded);
  };

  const getTasksByAgent = (agentId: string | null) => {
    return mockTasks.filter(task => task.assignedTo === agentId);
  };

  const getBotName = (agent: Agent | null, agentTasks: Task[]) => {
    if (!agent) return 'Unassigned';
    const capabilityText = agent.capabilities.join(' ').toLowerCase();
    const taskText = agentTasks.map(task => task.title).join(' ').toLowerCase();

    if (capabilityText.includes('ui') || capabilityText.includes('frontend') || taskText.includes('design')) {
      return 'Design Agent';
    }
    if (capabilityText.includes('api') || capabilityText.includes('backend') || taskText.includes('api')) {
      return 'API Agent';
    }
    if (capabilityText.includes('testing') || taskText.includes('test')) {
      return 'QA Agent';
    }
    if (capabilityText.includes('database') || taskText.includes('schema')) {
      return 'Data Architect';
    }
    if (capabilityText.includes('devops') || taskText.includes('deploy')) {
      return 'Infra Agent';
    }
    return 'Generalist Agent';
  };

  const getAgentWorkingState = (flags: RiskFlag[]) => {
    if (flags.includes('failing')) {
      return {
        label: 'Stuck in debug',
        style: 'bg-primary-200 text-error',
      };
    }
    if (flags.includes('stuck') || flags.includes('needs_review')) {
      return {
        label: 'Needs attention',
        style: 'bg-accent-100 text-accent-700',
      };
    }
    return {
      label: 'Working fine!',
      style: 'bg-primary-100 text-success',
    };
  };

  const renderFiles = (files: string[]) => {
    if (files.length === 0) {
      return <span className="text-xs text-text-tertiary">—</span>;
    }
    const display = files.slice(0, 2);
    const remaining = files.length - display.length;
    return (
      <div className="flex flex-wrap gap-1">
        {display.map(file => (
          <span
            key={file}
            className="text-xs px-2 py-0.5 bg-bg-tertiary border border-border rounded-full text-text-secondary"
          >
            {file.split('/').slice(-1)[0]}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs px-2 py-0.5 bg-bg-tertiary border border-border rounded-full text-text-tertiary">
            +{remaining}
          </span>
        )}
      </div>
    );
  };

  const renderAgentSection = (agent: Agent | null) => {
    const agentId = agent?.id || 'unassigned';
    const agentTasks = getTasksByAgent(agent?.id || null);
    const isExpanded = expandedAgents.has(agentId);
    const agentDisplayName = getBotName(agent, agentTasks);
    const agentRisks = Array.from(new Set(agentTasks.flatMap(task => task.riskFlags || [])));
    const todoCount = agentTasks.filter(task => task.status === 'todo').length;
    const todoPercent = agentTasks.length === 0 ? 0 : Math.round((todoCount / agentTasks.length) * 100);
    const workingState = getAgentWorkingState(agentRisks);

    return (
      <div key={agentId} className="mb-6">
        <div className="flex items-center justify-between bg-bg-elevated px-4 py-1.5 rounded-t-lg border border-border">
          <button
            onClick={() => toggleAgent(agentId)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            {isExpanded ? <CaretDown size={16} /> : <CaretRight size={16} />}
            <Avatar
              src={agent?.avatar}
              alt={agent?.name}
              fallback="🤖"
              className="w-8 h-8 rounded-full"
              textClassName="text-base"
            />
            <div>
              <div className="text-sm font-semibold text-text-primary">{agentDisplayName}</div>
              <div className="text-sm text-text-tertiary">
                {agent ? `Focus: ${agent.capabilities.slice(0, 3).join(', ')}` : 'Unassigned'}
                {' · '}
                {agentTasks.length} tasks
                {' · '}
                Todo {todoPercent}%
              </div>
            </div>
          </button>
          <div className="flex items-center gap-3">
            {agent && (
              <div className="hidden md:flex items-center gap-2 text-sm text-text-tertiary">
                <span>Context</span>
                <div className="w-20 h-1.5 bg-primary-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand"
                    style={{ width: `${agent.health}%` }}
                  />
                </div>
                <span className="text-text-secondary">{agent.health}%</span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-2">
              <span
                className={`text-sm px-2 py-0.5 rounded-full border border-border ${workingState.style}`}
              >
                {workingState.label}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border/70">
                <tr className="text-left text-xs text-text-tertiary uppercase tracking-wide">
                  <th className="w-32 px-4 py-1.5">Status</th>
                  <th className="px-4 py-1.5">Task</th>
                  <th className="px-4 py-1.5 w-52">Files changed</th>
                  <th className="px-4 py-1.5 w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-bg-elevated">
                {agentTasks.map((task, index) => {
                  const statusInfo = getStatusMeta(task.status);

                  return (
                    <Fragment key={task.id}>
                    <tr
                      className={`
                        border-t border-border/70 hover:bg-bg-tertiary/40 transition-colors
                        ${task.status === 'blocked' ? 'border-l-2 border-error/70 bg-error/5' : ''}
                        ${index === agentTasks.length - 1 ? '' : ''}
                      `}
                    >
                      <td className="px-4 py-2.5 align-middle">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusInfo.dot}`} />
                          <span className={`text-[11px] uppercase tracking-wide whitespace-nowrap ${statusInfo.text}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-mono text-text-tertiary">
                            #{task.id.split('-')[1]}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-text-primary line-clamp-1">
                              {task.title} <span className="text-text-tertiary font-normal">— {task.description}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        {renderFiles(task.changedFiles)}
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        <div className="flex items-center gap-2">
                          <button
                            title="Open diff"
                            aria-label="Open diff"
                            className="h-7 w-7 border border-border/70 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary flex items-center justify-center"
                          >
                            <GitDiff size={14} />
                          </button>
                          <button
                            title="Open editor"
                            aria-label="Open editor"
                            className="h-7 w-7 border border-border/70 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary flex items-center justify-center"
                          >
                            <ArrowSquareOut size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-3 py-1.5 text-sm border border-border rounded bg-bg-elevated text-text-secondary">
            <option>Status: All</option>
            <option>Status: TODO</option>
            <option>Status: In Progress</option>
            <option>Status: Review</option>
            <option>Status: Done</option>
            <option>Status: Blocked</option>
            <option>Status: Canceled</option>
          </select>
          <select className="px-3 py-1.5 text-sm border border-border rounded bg-bg-elevated text-text-secondary">
            <option>Sort: Created Date</option>
            <option>Sort: Status</option>
          </select>
        </div>
        <button className="px-4 py-1.5 text-sm bg-brand hover:bg-brand/90 text-white rounded transition-colors">
          + Add Task
        </button>
      </div>

      <div className="space-y-6">
        {mockAgents.map(agent => renderAgentSection(agent))}
        {renderAgentSection(null)}
      </div>

    </div>
  );
}
