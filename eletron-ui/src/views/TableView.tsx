import { Fragment, useEffect, useRef, useState } from 'react';
import { mockTasks, mockAgents } from '../data/mockData';
import { Task, Agent, RiskFlag, TaskStatus } from '../types';
import Avatar from '../components/Avatar';
import ViewTabs from '../components/layout/ViewTabs';
import { useRightPanel } from '../context/RightPanelContext';
import {
  CaretDown,
  CaretRight,
  GitDiff,
  ArrowSquareOut,
  FunnelSimple,
  PaperPlaneRight,
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
  const { openDiff, openChat } = useRightPanel();
  const [compactOpenId, setCompactOpenId] = useState<string | null>(null);
  const [compactNotes, setCompactNotes] = useState<Record<string, string>>({});
  const compactRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!compactOpenId) return;
    const handleClick = (event: MouseEvent) => {
      if (compactRef.current && !compactRef.current.contains(event.target as Node)) {
        setCompactOpenId(null);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [compactOpenId]);

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
          <button
            key={file}
            type="button"
            onClick={() => openDiff(file)}
            className="text-xs px-2 py-0.5 bg-bg-tertiary border border-border rounded-full text-text-secondary hover:text-text-primary"
          >
            {file.split('/').slice(-1)[0]}
          </button>
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
    const compactNote = compactNotes[agentId] || '';
    const agentRisks = Array.from(new Set(agentTasks.flatMap(task => task.riskFlags || [])));
    const todoCount = agentTasks.filter(task => task.status === 'todo').length;
    const todoPercent = agentTasks.length === 0 ? 0 : Math.round((todoCount / agentTasks.length) * 100);
    const workingState = getAgentWorkingState(agentRisks);

    return (
      <div key={agentId} className="mb-6">
        <div className="flex items-center justify-between bg-bg-elevated px-4 py-1.5 rounded-t-lg border border-border">
          <div
            onClick={() => toggleAgent(agentId)}
            className="flex items-center gap-3 flex-1 text-left cursor-pointer"
          >
            {isExpanded ? <CaretDown size={16} /> : <CaretRight size={16} />}
            {agent ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openChat({ id: agent.id, name: agent.name });
                }}
                className="flex items-center gap-3 text-left"
                title="Open chat"
              >
                <Avatar
                  src={agent.avatar}
                  alt={agent.name}
                  fallback={agent.name[0]}
                  className="w-8 h-8 rounded-full"
                  textClassName="text-base"
                />
                <div>
                  <div className="text-sm font-semibold text-text-primary">{agentDisplayName}</div>
                  <div className="text-sm text-text-tertiary">
                    {`Focus: ${agent.capabilities.slice(0, 3).join(', ')}`}
                    {' · '}
                    {agentTasks.length} tasks
                    {' · '}
                    Todo {todoPercent}%
                  </div>
                </div>
              </button>
            ) : (
              <>
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
                    Unassigned · {agentTasks.length} tasks · Todo {todoPercent}%
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {agent && (
              <>
                <div className="relative hidden md:flex items-center">
                  <button
                    onClick={() => setCompactOpenId((prev) => (prev === agentId ? null : agentId))}
                    className="text-xs px-2.5 py-1 border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  >
                    Compact
                  </button>
                  {compactOpenId === agentId && (
                    <div
                      ref={compactRef}
                      className="absolute right-0 top-full mt-2 w-72 rounded-md border border-border bg-bg-elevated px-3 py-2 text-xs text-text-secondary shadow-soft"
                    >
                    <div className="text-[11px] text-text-tertiary mb-1">
                      Optional: key memory to keep?
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={compactNote}
                        onChange={(event) =>
                          setCompactNotes((prev) => ({ ...prev, [agentId]: event.target.value }))
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            setCompactOpenId(null);
                          }
                        }}
                        className="flex-1 bg-bg-tertiary border border-border rounded-md px-2 py-1 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
                        placeholder="Summarize what matters most..."
                      />
                      <button
                        type="button"
                        onClick={() => setCompactOpenId(null)}
                        className="h-7 w-7 rounded-md border border-border text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary flex items-center justify-center"
                        title="Send"
                      >
                        <PaperPlaneRight size={12} weight="light" />
                      </button>
                    </div>
                  </div>
                )}
                </div>
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
              </>
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
                <tr className="border-t border-border/70 bg-bg-elevated">
                  <td colSpan={4} className="px-4 py-2">
                    <button className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-text-tertiary">
                        +
                      </span>
                      Add task
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <ViewTabs
        right={(
          <>
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg-elevated hover:text-text-primary transition-colors">
              <FunnelSimple size={12} weight="light" />
              Filter
            </button>
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg-elevated hover:text-text-primary transition-colors">
              Status: All
              <CaretDown size={12} weight="light" />
            </button>
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg-elevated hover:text-text-primary transition-colors">
              Sort: Created
              <CaretDown size={12} weight="light" />
            </button>
          </>
        )}
      />

      <div className="p-6 space-y-6">
        {mockAgents.map(agent => renderAgentSection(agent))}
        {renderAgentSection(null)}
      </div>
    </div>
  );
}
