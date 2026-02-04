import { mockProject } from '../../data/mockData';
import { Folder, Robot } from '@phosphor-icons/react';

export default function ProjectHeader() {
  const { name, status, agents } = mockProject;

  const statusColors = {
    active: 'bg-success',
    paused: 'bg-primary-400',
    completed: 'bg-primary-300',
  };

  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'busy').length;

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Folder className="text-text-tertiary" size={18} />
          <h2 className="text-sm font-semibold text-text-primary">{name}</h2>
        </div>
        <div className="flex items-center gap-2 text-text-tertiary">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <span className="capitalize text-text-secondary">{status}</span>
        </div>
        <div className="flex items-center gap-2 text-text-tertiary">
          <Robot size={14} />
          <span className="text-text-secondary">{activeAgents} agents</span>
        </div>
      </div>
    </div>
  );
}
