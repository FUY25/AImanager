import { Task, Agent } from '../types';
import { LinkSimple, WarningCircle } from '@phosphor-icons/react';
import Avatar from './Avatar';

interface TaskCardProps {
  task: Task;
  agent?: Agent;
  onClick?: () => void;
  accentClassName?: string;
  progressClassName?: string;
  avatarClassName?: string;
}

export default function TaskCard({
  task,
  agent,
  onClick,
  accentClassName,
  progressClassName = 'bg-brand',
  avatarClassName = 'w-8 h-8 rounded-full',
}: TaskCardProps) {
  const priorityColors = {
    low: 'border-primary-200',
    medium: 'border-primary-300',
    high: 'border-primary-500',
  };

  const progressValue = task.status === 'done' ? 100 : task.progress;
  const accent = accentClassName || priorityColors[task.priority];

  return (
    <div
      onClick={onClick}
      className={`
        bg-bg-elevated border-l-2 ${accent}
        rounded-md p-3 mb-2 cursor-pointer
        hover:shadow-soft transition-all duration-200
        border border-border
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium text-text-tertiary">
          #{task.id.split('-')[1]}
        </span>
        {agent && (
          <Avatar
            src={agent.avatar}
            alt={agent.name}
            fallback={agent.name[0]}
            className={`${avatarClassName} shadow-[0_8px_16px_rgba(40,35,28,0.12)]`}
            textClassName="text-sm"
            ring
            presence
            presenceStatus={agent.status}
          />
        )}
      </div>

      <h3 className="text-sm font-semibold text-text-primary mb-1.5 line-clamp-2 leading-snug">
        {task.title}
      </h3>

      <p className="text-xs text-text-tertiary mb-2 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-border/70">
        <div className="flex items-center gap-3">
          {task.dependencies.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-tertiary">
              <WarningCircle size={14} />
              <span>{task.dependencies.length} dep{task.dependencies.length > 1 ? 's' : ''}</span>
            </div>
          )}
          {task.blocks.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <LinkSimple size={14} />
              <span>→#{task.blocks[0].split('-')[1]}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 bg-bg-tertiary border border-border rounded-md px-3 py-1.5">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>{progressValue}%</span>
        </div>
        <div className="mt-1.5 h-1 bg-primary-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${progressClassName}`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    </div>
  );
}
