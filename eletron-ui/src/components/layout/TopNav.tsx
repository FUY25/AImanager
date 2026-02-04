import { MagnifyingGlass, Bell, Moon, Gear } from '@phosphor-icons/react';

export default function TopNav() {
  return (
    <nav className="bg-bg-elevated border-b border-border px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 bg-bg-tertiary border border-border rounded-md px-3 py-1.5">
            <MagnifyingGlass size={14} className="text-text-tertiary" />
            <input
              className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Search issues, agents, docs"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors cursor-pointer">
            <Bell size={16} />
          </button>
          <button className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors cursor-pointer">
            <Gear size={16} />
          </button>
          <button className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors cursor-pointer">
            <Moon size={16} />
          </button>
          <div className="w-8 h-8 bg-bg-tertiary border border-border rounded-full flex items-center justify-center text-text-secondary text-xs font-semibold">
            U
          </div>
        </div>
      </div>
    </nav>
  );
}
