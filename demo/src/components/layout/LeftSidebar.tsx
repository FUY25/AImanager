import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { mockProject } from '../../data/mockData';
import {
  Tray,
  Gear,
  Database,
  Folder,
  Gauge,
  SquaresFour,
  ChatCircleText,
  Files,
  Users,
  Plus,
  CaretDown,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';

const baseItem =
  'flex items-center gap-2 rounded-md text-xs font-medium transition-colors';
const iconWrap = 'w-4 h-4 flex items-center justify-center text-text-tertiary';

const getItemClass = (isActive: boolean, collapsed: boolean) =>
  [
    baseItem,
    collapsed ? 'justify-center px-2 py-1.5' : 'px-3 py-1.5',
    isActive
      ? 'bg-bg-tertiary text-text-primary'
      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
  ].join(' ');

export default function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [projectExpanded, setProjectExpanded] = useState(true);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('project-1');
  const location = useLocation();
  const navigate = useNavigate();
  const isAgentsRoute = location.pathname.startsWith('/agents');
  const projects = [
    { id: 'project-1', name: mockProject.name },
    { id: 'project-2', name: 'Mobile App Refresh' },
    { id: 'project-3', name: 'Growth Experiments' },
  ];
  const projectViews = [
    { label: 'Dashboard', path: '/' },
    { label: 'Agent views', path: '/agents/table' },
    { label: 'Files', path: '/files' },
  ];
  const activeProject = projects.find(project => project.id === activeProjectId) || projects[0];

  return (
    <aside
      className={[
        'h-screen sticky top-0 border-r border-border bg-bg-elevated flex flex-col',
        collapsed ? 'w-16' : 'w-64',
      ].join(' ')}
    >
        <div className="px-4 pt-3 pb-2">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-border bg-bg-tertiary flex items-center justify-center text-xs font-semibold text-text-primary">
                F
              </div>
              {!collapsed && (
              <div className="text-xs font-medium text-text-primary">Fuyuming</div>
              )}
            </div>
          {!collapsed ? (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary"
              aria-label="Collapse sidebar"
            >
              <CaretLeft size={16} />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary"
              aria-label="Expand sidebar"
            >
              <CaretRight size={16} />
            </button>
          )}
        </div>
      </div>

      <nav className={collapsed ? 'px-2 flex flex-col gap-2' : 'px-3 space-y-3'}>
        <div className={collapsed ? 'space-y-0' : 'space-y-1'}>
          <NavLink to="/inbox" className={({ isActive }) => getItemClass(isActive, collapsed)}>
            <span className={iconWrap}>
              <Tray size={14} />
            </span>
            {!collapsed && <span>Inbox</span>}
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => getItemClass(isActive, collapsed)}>
            <span className={iconWrap}>
              <ChatCircleText size={14} />
            </span>
            {!collapsed && <span>Chat</span>}
          </NavLink>
        </div>

        <div className={collapsed ? 'space-y-0' : 'space-y-2'}>
          {!collapsed && (
            <div className="px-3 text-[11px] uppercase tracking-[0.18em] text-text-tertiary flex items-center justify-between">
              <span>Projects</span>
              <button
                className="text-text-tertiary hover:text-text-primary"
                aria-label="Add project"
              >
                <Plus size={11} />
              </button>
            </div>
          )}
          <div className={collapsed ? 'relative' : 'px-1'}>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  setProjectMenuOpen((prev) => !prev);
                } else {
                  setProjectExpanded((prev) => !prev);
                }
              }}
              className={`${getItemClass(false, collapsed)} w-full`}
              aria-expanded={projectExpanded}
            >
              <span className={iconWrap}>
                <Folder size={14} />
              </span>
              {!collapsed && (
                <div className="flex items-center gap-2">
                  <span className="truncate">{activeProject.name}</span>
                  <CaretDown
                    size={12}
                    className={`text-text-tertiary ${projectExpanded ? '' : '-rotate-90'}`}
                  />
                </div>
              )}
            </button>
            {collapsed && projectMenuOpen && (
              <div className="absolute left-14 top-0 z-20 w-64 bg-bg-elevated border border-border rounded-lg shadow-strong p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary mb-2">
                  Projects
                </div>
                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <div className="space-y-1">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setActiveProjectId(project.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs ${
                          activeProjectId === project.id
                            ? 'bg-bg-tertiary text-text-primary'
                            : 'text-text-secondary hover:bg-bg-tertiary'
                        }`}
                      >
                        {project.name}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary mb-1">
                      Views
                    </div>
                    {projectViews.map((view) => (
                      <button
                        key={view.path}
                        onClick={() => {
                          navigate(view.path);
                          setProjectMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!collapsed && projectExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => getItemClass(isActive, false)}
                >
                  <span className={iconWrap}>
                    <Gauge size={13} />
                  </span>
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/agents/table"
                  className={({ isActive }) => getItemClass(isActive || isAgentsRoute, false)}
                >
                  <span className={iconWrap}>
                    <SquaresFour size={13} />
                  </span>
                  <span>Agent views</span>
                </NavLink>
                <NavLink
                  to="/files"
                  className={({ isActive }) => getItemClass(isActive, false)}
                >
                  <span className={iconWrap}>
                    <Files size={13} />
                  </span>
                  <span>Files</span>
                </NavLink>
              </div>
            )}
          </div>

          <div className={collapsed ? '' : 'pt-2'}>
            <NavLink to="/roles" className={({ isActive }) => getItemClass(isActive, collapsed)}>
              <span className={iconWrap}>
                <Users size={14} />
              </span>
              {!collapsed && <span>Apprentices</span>}
            </NavLink>
          </div>
        </div>

        <div className={collapsed ? 'space-y-0' : 'space-y-1'}>
          <NavLink to="/api" className={({ isActive }) => getItemClass(isActive, collapsed)}>
            <span className={iconWrap}>
              <Database size={14} />
            </span>
            {!collapsed && <span>API usage</span>}
          </NavLink>
          <button className={getItemClass(false, collapsed)} title="Settings">
            <span className={iconWrap}>
              <Gear size={14} />
            </span>
            {!collapsed && <span>Settings</span>}
          </button>
        </div>
      </nav>

      <div className="mt-auto px-3 py-4">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary"
            aria-label="Expand sidebar"
          >
            <CaretRight size={14} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(true)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary text-[11px]"
          >
            <CaretLeft size={12} />
            Collapse
          </button>
        )}
      </div>
    </aside>
  );
}
