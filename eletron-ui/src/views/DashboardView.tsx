import { useRef, useState } from 'react';
import { mockProject, mockDocs, mockUpdates, mockAgents, mockTasks } from '../data/mockData';
import Avatar from '../components/Avatar';
import { FileText, CloudArrowUp, GitDiff } from '@phosphor-icons/react';
import { TaskStatus } from '../types';
import { useRightPanel } from '../context/RightPanelContext';

const getAgent = (agentId: string) => {
  return mockAgents.find(agent => agent.id === agentId) || null;
};

const taskStatusMeta: Record<
  TaskStatus,
  { label: string; text: string; dot: string }
> = {
  todo: {
    label: 'To do',
    text: 'text-text-tertiary',
    dot: 'bg-primary-300',
  },
  in_progress: {
    label: 'In progress',
    text: 'text-accent-700',
    dot: 'bg-brand',
  },
  review: {
    label: 'Review',
    text: 'text-accent-700',
    dot: 'bg-accent-500',
  },
  done: {
    label: 'Done',
    text: 'text-success',
    dot: 'bg-success',
  },
  blocked: {
    label: 'Blocked',
    text: 'text-error',
    dot: 'bg-error',
  },
  canceled: {
    label: 'Canceled',
    text: 'text-text-secondary',
    dot: 'bg-primary-400',
  },
};

export default function DashboardView() {
  const { openArtifact } = useRightPanel();
  const [projectOverview, setProjectOverview] = useState(mockProject.description);
  const [knowledgeDraft, setKnowledgeDraft] = useState('');
  const [knowledgeEntries, setKnowledgeEntries] = useState<
    { id: string; note: string; timestamp: string }[]
  >([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);

  const handleKnowledgeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = knowledgeDraft.trim();
    if (!trimmed) return;

    setKnowledgeEntries(prev => [
      {
        id: `knowledge-${Date.now()}`,
        note: trimmed,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev,
    ]);
    setKnowledgeDraft('');
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = Math.max(dragCounter.current - 1, 0);
    if (dragCounter.current <= 0) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = 0;
    setIsDragActive(false);
  };

  return (
    <div
      className="flex-1 overflow-auto p-6 pt-4 space-y-6"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-elevated border border-border rounded-lg p-5">
          <h3 className="text-sm font-prata text-text-primary uppercase tracking-wide mb-3">
            Project Overview
          </h3>
          <textarea
            value={projectOverview}
            onChange={(event) => setProjectOverview(event.target.value)}
            className="w-full min-h-[120px] bg-transparent text-sm text-text-secondary leading-relaxed resize-none focus:outline-none"
            aria-label="Project overview"
          />
        </div>

        <div className="bg-bg-elevated border border-border rounded-lg p-5 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-prata text-text-primary uppercase tracking-wide">
              Important Docs
            </h3>
            <label
              htmlFor="doc-upload"
              className="text-sm px-2.5 py-1 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Upload
            </label>
            <input id="doc-upload" type="file" multiple className="hidden" />
          </div>
          <div className="space-y-3">
            {mockDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => openArtifact({ id: doc.id, name: doc.name })}
                className="flex items-center justify-between text-sm bg-bg-tertiary border border-border rounded-md px-3 py-2 text-left hover:text-text-primary"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-text-tertiary" />
                  <span className="text-text-primary">{doc.name}</span>
                </div>
                <span className="text-text-tertiary">{doc.updatedAtLabel}</span>
              </button>
            ))}
          </div>
          {isDragActive && (
            <div className="absolute inset-4 rounded-lg border-2 border-dashed border-brand bg-bg-elevated/70 backdrop-blur-sm flex items-center justify-center text-brand pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
                  <CloudArrowUp size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium">Drop files here to upload</div>
                  <div className="text-xs text-text-tertiary">Release to add them to the docs list.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-bg-elevated border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-prata text-text-primary uppercase tracking-wide">
              Project Tasks
            </h3>
          </div>
          <div className="text-sm text-text-tertiary">
            {mockTasks.length} tasks
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-sm uppercase tracking-wide text-text-tertiary">
              <tr>
                <th className="text-left pb-2">Task</th>
                <th className="text-left pb-2">Status</th>
                <th className="text-left pb-2 min-w-[140px]">Agent</th>
                <th className="text-left pb-2">Progress</th>
                <th className="text-left pb-2">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockTasks.map(task => {
                const statusMeta = taskStatusMeta[task.status];
                const assignedAgent = task.assignedTo
                  ? mockAgents.find(agent => agent.id === task.assignedTo)
                  : null;
                const progressValue = task.status === 'done' ? 100 : task.progress;
                return (
                  <tr key={task.id} className="text-text-secondary">
                    <td className="py-3 pr-4">
                      <div className="text-text-primary font-medium line-clamp-1">
                        {task.title} <span className="text-text-tertiary font-normal">— {task.description}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusMeta.dot}`} />
                        <span className={`text-[11px] uppercase tracking-wide ${statusMeta.text}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {assignedAgent ? (
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Avatar
                            src={assignedAgent.avatar}
                            alt={assignedAgent.name}
                            fallback={assignedAgent.name[0]}
                            className="w-5 h-5 rounded-full"
                            textClassName="text-xs"
                          />
                          <span className="text-text-primary whitespace-nowrap">{assignedAgent.name}</span>
                        </div>
                      ) : (
                        <span className="text-text-tertiary whitespace-nowrap">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-primary-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand"
                            style={{ width: `${progressValue}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-tertiary w-10 text-right">
                          {progressValue}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {task.updatedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-bg-elevated border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-prata text-text-primary uppercase tracking-wide">
            Recent Updates
          </h3>
          <div className="text-sm text-text-tertiary">Last 7 days</div>
        </div>
        <div className="space-y-3">
          {mockUpdates.map(update => {
            const agent = getAgent(update.agentId);
            return (
              <div
                key={update.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-bg-tertiary border border-border rounded-md px-3 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={agent?.avatar}
                    alt={agent?.name}
                    fallback={agent?.name?.[0] || 'A'}
                    className="w-7 h-7 rounded-full shadow-[0_6px_12px_rgba(40,35,28,0.16)]"
                    textClassName="text-sm"
                    ring
                    presence={Boolean(agent)}
                    presenceStatus={agent?.status || 'idle'}
                  />
                  <div className="text-sm font-semibold text-text-primary line-clamp-1">
                    {update.summary}
                    <span className="text-text-tertiary font-normal"> · {update.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-text-tertiary">
                  <GitDiff size={14} />
                  <span>{update.filesChanged.length} files</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-bg-elevated border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-prata text-text-primary uppercase tracking-wide">
              Project Knowledge
            </h3>
            <div className="text-sm text-text-tertiary mt-1">
              Manual entries that become agent learnings per session.
            </div>
          </div>
          <div className="text-sm text-text-tertiary">
            {knowledgeEntries.length} entries
          </div>
        </div>

        <form onSubmit={handleKnowledgeSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
          <div className="bg-bg-tertiary border border-border rounded-md px-3 py-2">
            <input
              value={knowledgeDraft}
              onChange={(event) => setKnowledgeDraft(event.target.value)}
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Add a learning, decision, or discovery..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-brand hover:bg-brand/90 text-white rounded transition-colors disabled:opacity-60"
            disabled={!knowledgeDraft.trim()}
          >
            Log entry
          </button>
        </form>

        <div className="mt-4 space-y-3">
          {knowledgeEntries.length === 0 && (
            <div className="text-sm text-text-tertiary bg-bg-tertiary border border-dashed border-border rounded-md px-4 py-3">
              No knowledge entries yet. Capture learnings after each session.
            </div>
          )}
          {knowledgeEntries.map(entry => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 bg-bg-tertiary border border-border rounded-md px-4 py-3 text-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">N</span>
                <div>
                  <div className="text-text-primary font-medium">{entry.note}</div>
                  <div className="text-text-tertiary mt-1">
                    {entry.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
