import { useState } from 'react';
import { mockTasks, mockAgents } from '../data/mockData';
import { Task, TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';
import { Plus, X } from '@phosphor-icons/react';
import Avatar from '../components/Avatar';

export default function KanbanView() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns: {
    status: TaskStatus;
    label: string;
    lane: string;
    header: string;
    stripe: string;
    progress: string;
  }[] = [
    {
      status: 'todo',
      label: 'To do',
      lane: 'bg-primary-100/70 border-primary-200',
      header: 'text-text-secondary',
      stripe: 'border-primary-300',
      progress: 'bg-primary-400',
    },
    {
      status: 'in_progress',
      label: 'In progress',
      lane: 'bg-accent-100/60 border-accent-200',
      header: 'text-accent-700',
      stripe: 'border-brand',
      progress: 'bg-brand',
    },
    {
      status: 'review',
      label: 'Review',
      lane: 'bg-primary-100/60 border-primary-200',
      header: 'text-warning',
      stripe: 'border-warning',
      progress: 'bg-warning',
    },
    {
      status: 'done',
      label: 'Done',
      lane: 'bg-success/10 border-success/30',
      header: 'text-success',
      stripe: 'border-success',
      progress: 'bg-success',
    },
    {
      status: 'blocked',
      label: 'Blocked',
      lane: 'bg-error/10 border-error/30',
      header: 'text-error',
      stripe: 'border-error',
      progress: 'bg-error',
    },
    {
      status: 'canceled',
      label: 'Canceled',
      lane: 'bg-primary-200/80 border-primary-300',
      header: 'text-text-secondary',
      stripe: 'border-primary-400',
      progress: 'bg-primary-500',
    },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getAgentById = (agentId: string | null) => {
    if (!agentId) return undefined;
    return mockAgents.find(agent => agent.id === agentId);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 pt-3 flex items-center gap-2 text-sm">
        <button className="px-3 py-1 rounded-full border border-border bg-bg-tertiary text-text-primary">
          All
        </button>
        <button className="px-3 py-1 rounded-full border border-border text-text-tertiary hover:text-text-primary">
          Assigned
        </button>
        <button className="px-3 py-1 rounded-full border border-border text-text-tertiary hover:text-text-primary">
          Blocked
        </button>
        <div className="ml-auto text-text-tertiary">12 tasks</div>
      </div>

      <div className="h-full flex gap-3 p-4 sm:p-5 lg:p-6 overflow-x-auto">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <div
              key={column.status}
              className={`flex-shrink-0 w-64 border rounded-lg p-3 ${column.lane}`}
            >
              <div className="flex items-end justify-between mb-3 min-h-[30px]">
                <h3 className={`text-base font-semibold leading-tight ${column.header}`}>
                  {column.label}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-bg-elevated text-text-tertiary">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    agent={getAgentById(task.assignedTo)}
                    accentClassName={column.stripe}
                    progressClassName={column.progress}
                    avatarClassName="w-8 h-8 rounded-full"
                    onClick={() => setSelectedTask(task)}
                  />
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-10 text-text-tertiary text-sm">
                    No tasks
                  </div>
                )}
              </div>

              {column.status === 'todo' && (
                <button className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all cursor-pointer border border-dashed border-border">
                  <Plus size={18} />
                  <span>Add Task</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTask(null)}
        >
          <div
          className="bg-bg-elevated rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-strong border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-semibold text-text-tertiary">
                  #{selectedTask.id.split('-')[1]}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide ${
                  selectedTask.priority === 'high' ? 'bg-primary-200 text-text-primary' :
                  selectedTask.priority === 'medium' ? 'bg-accent-100 text-accent-700' :
                  'bg-primary-100 text-text-secondary'
                }`}>
                  {selectedTask.priority}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-text-primary leading-tight">
                {selectedTask.title}
              </h2>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-text-primary mb-2 uppercase tracking-wide">Description</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{selectedTask.description}</p>
              </div>

              {selectedTask.assignedTo && (
                <div>
                  <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">Assigned To</h3>
                  <div className="flex items-center gap-3 p-3 bg-bg-tertiary border border-border rounded-lg">
                    <Avatar
                      src={getAgentById(selectedTask.assignedTo)?.avatar}
                      alt={getAgentById(selectedTask.assignedTo)?.name}
                      fallback={getAgentById(selectedTask.assignedTo)?.name?.[0] || 'A'}
                      className="w-10 h-10 rounded-md"
                      textClassName="text-base"
                    />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {getAgentById(selectedTask.assignedTo)?.name}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {getAgentById(selectedTask.assignedTo)?.type}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask.dependencies.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">Dependencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.dependencies.map((depId) => {
                      const depTask = tasks.find(t => t.id === depId);
                      return (
                        <span
                          key={depId}
                          className="text-xs px-3 py-1.5 bg-bg-tertiary text-text-secondary rounded-lg font-medium cursor-pointer hover:bg-primary-100 transition-colors border border-border"
                        >
                          #{depId.split('-')[1]} {depTask?.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedTask.blocks.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">Blocks</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.blocks.map((blockId) => {
                      const blockTask = tasks.find(t => t.id === blockId);
                      return (
                        <span
                          key={blockId}
                          className="text-xs px-3 py-1.5 bg-primary-100 text-text-secondary rounded-lg font-medium cursor-pointer hover:bg-primary-200 transition-colors border border-border"
                        >
                          #{blockId.split('-')[1]} {blockTask?.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedTask.status === 'in_progress' && (
                <div>
                  <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">Progress</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-primary-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand transition-all duration-300"
                        style={{ width: `${selectedTask.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-text-primary min-w-[3rem] text-right">{selectedTask.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
