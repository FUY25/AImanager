import { Link, useLocation } from 'react-router-dom';
import { SquaresFour, Table, Sliders } from '@phosphor-icons/react';

export default function ViewTabs() {
  const location = useLocation();

  const tabs = [
    { path: '/agents/table', label: 'Table', icon: Table },
    { path: '/agents/kanban', label: 'Kanban', icon: SquaresFour },
    { path: '/agents/customize', label: 'Customize', icon: Sliders },
  ];

  return (
    <div className="border-b border-border bg-bg-elevated">
      <div className="grid grid-cols-3 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer
                ${isActive
                  ? 'text-text-primary border-b-2 border-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
