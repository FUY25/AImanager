import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Moon, SidebarSimple, CaretLeft, CaretRight } from '@phosphor-icons/react';

type TopNavProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleRightPanel: () => void;
};

export default function TopNav({ collapsed, onToggleSidebar, onToggleRightPanel }: TopNavProps) {
  const navigate = useNavigate();
  const sidebarWidth = collapsed ? 68 : 256;
  const toolbarLeft = (collapsed ? 92 : 84) - sidebarWidth;
  const toolbarIconSize = 18;
  const toggleIconSize = collapsed ? 20 : 18;
  const toolbarIconWeight = 'light';

  return (
    <nav className="sticky top-0 z-30 bg-bg-elevated/95 backdrop-blur border-b border-border h-9 relative">
      <div
        className="absolute top-0 h-full flex items-center"
        style={{ left: toolbarLeft }}
      >
        <div className="inline-flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <SidebarSimple size={toggleIconSize} weight={toolbarIconWeight} />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary"
            aria-label="Go back"
            title="Go back"
          >
            <CaretLeft size={toolbarIconSize} weight={toolbarIconWeight} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary opacity-60"
            aria-label="Go forward"
            title="Go forward"
          >
            <CaretRight size={toolbarIconSize} weight={toolbarIconWeight} />
          </button>
        </div>
      </div>
      <div className="h-full px-6 grid grid-cols-[1fr_auto_1fr] items-center">
        <div />
        <div
          className="flex items-center gap-2 bg-bg-tertiary border border-border rounded-full px-3 py-0.5 w-[360px]"
          style={{ transform: `translateX(-${sidebarWidth / 2}px)` }}
        >
          <MagnifyingGlass
            size={12}
            weight={toolbarIconWeight}
            className="text-text-tertiary"
          />
          <input
            className="w-full bg-transparent text-[11px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
            placeholder="Search"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors cursor-pointer"
            title="Toggle theme"
          >
            <Moon size={16} weight={toolbarIconWeight} />
          </button>
          <button
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors cursor-pointer"
            title="Toggle right panel"
            onClick={onToggleRightPanel}
          >
            <SidebarSimple
              size={16}
              weight={toolbarIconWeight}
              className="scale-x-[-1]"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
