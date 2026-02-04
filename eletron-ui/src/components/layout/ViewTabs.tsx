import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SquaresFour, Table, Sliders } from '@phosphor-icons/react';

type ViewTabsProps = {
  right?: ReactNode;
};

export default function ViewTabs({ right }: ViewTabsProps) {
  const location = useLocation();

  const tabs = [
    { path: '/agents/table', label: 'Table', icon: Table },
    { path: '/agents/kanban', label: 'Kanban', icon: SquaresFour },
    { path: '/agents/customize', label: 'Customize', icon: Sliders },
  ];

  return (
    <div className="border-b border-border/70 bg-bg-elevated">
      <div className="flex items-center justify-between gap-6 px-6 py-2.5">
        <div className="flex items-center gap-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                flex items-center justify-center gap-2 px-1 py-1.5 text-[13px] font-medium transition-all cursor-pointer
                ${isActive
                  ? 'text-text-primary border-b-2 border-text-primary/80 -mb-[2px]'
                  : 'text-text-tertiary hover:text-text-primary'
                }
              `}
            >
              <Icon size={14} weight="light" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
        </div>
        {right && <div className="flex items-center gap-2 text-xs text-text-secondary">{right}</div>}
      </div>
    </div>
  );
}
