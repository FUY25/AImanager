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
  Trash,
  Plus,
  CaretDown,
} from '@phosphor-icons/react';

const baseItem =
  'flex items-center gap-2 rounded-md text-xs font-medium transition-colors';
const iconWrapBase = 'flex items-center justify-center text-text-tertiary';

const getItemClass = (isActive: boolean, collapsed: boolean) =>
  [
    baseItem,
    collapsed ? 'justify-center px-2 py-1.5 w-full h-10' : 'px-3 py-1.5',
    isActive
      ? 'bg-bg-tertiary text-text-primary'
      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
  ].join(' ');

type LeftSidebarProps = {
  collapsed: boolean;
};

export default function LeftSidebar({ collapsed }: LeftSidebarProps) {
  const [projectExpanded, setProjectExpanded] = useState(true);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projectViewsOpen, setProjectViewsOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('project-1');
  const location = useLocation();
  const navigate = useNavigate();
  const isAgentsRoute = location.pathname.startsWith('/agents');
  const iconWrap = `${iconWrapBase} ${collapsed ? 'w-6 h-6' : 'w-4 h-4'}`;
  const subIconWrap = `${iconWrapBase} w-4 h-4`;
  const iconSize = collapsed ? 20 : 14;
  const subIconSize = 13;
  const iconWeight = 'light';
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
        'h-screen sticky top-0 border-r border-border bg-bg-elevated flex flex-col relative',
        collapsed ? 'w-[68px]' : 'w-64',
      ].join(' ')}
    >
      <div className="h-10" />
      <div className={collapsed ? 'px-2 pt-3 pb-2' : 'px-4 pt-3 pb-2'}>
        <div className={collapsed ? 'flex justify-center' : 'flex items-center gap-2'}>
          <div className="w-8 h-8 rounded-full border border-border bg-bg-tertiary flex items-center justify-center text-xs font-semibold text-text-primary">
            F
          </div>
          {!collapsed && <div className="text-xs font-medium text-text-primary">Fuyuming</div>}
        </div>
      </div>

      <nav
        className={[
          collapsed ? 'px-2 pt-2' : 'px-3 pt-2',
          'flex flex-1 flex-col pb-4',
        ].join(' ')}
      >
        {collapsed ? (
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-2">
            <NavLink
              to="/inbox"
              title="Inbox"
              className={({ isActive }) => getItemClass(isActive, true)}
            >
              <span className={iconWrap}>
                <Tray size={iconSize} weight={iconWeight} />
              </span>
            </NavLink>
            <NavLink
              to="/chat"
              title="Chat"
              className={({ isActive }) => getItemClass(isActive, true)}
            >
              <span className={iconWrap}>
                <ChatCircleText size={iconSize} weight={iconWeight} />
              </span>
            </NavLink>
            <div className="relative">
              <button
                type="button"
                title="Projects"
                onClick={() => {
                  setProjectMenuOpen((prev) => {
                    const next = !prev;
                    if (next) {
                      setProjectViewsOpen(false);
                    }
                    return next;
                  });
                }}
                className={`${getItemClass(false, true)} w-full`}
                aria-expanded={projectExpanded}
              >
                <span className={iconWrap}>
                  <Folder size={iconSize} weight={iconWeight} />
                </span>
              </button>
              {projectMenuOpen && (
                <div className="absolute left-14 top-0 z-[80] w-56 bg-bg-elevated border border-border rounded-lg shadow-strong p-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary mb-2">
                    Projects
                  </div>
                  <div className="space-y-1">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveProjectId(project.id);
                          setProjectViewsOpen(true);
                        }}
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
                  {projectViewsOpen && (
                    <>
                      <div className="h-px bg-border/70 my-2" />
                      <div className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary mb-1">
                        Views
                      </div>
                      <div className="space-y-1">
                        {projectViews.map((view) => (
                          <button
                            key={view.path}
                            onClick={() => {
                              navigate(view.path);
                              setProjectMenuOpen(false);
                              setProjectViewsOpen(false);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                          >
                            {view.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <NavLink
              to="/roles"
              title="Apprentices"
              className={({ isActive }) => getItemClass(isActive, true)}
            >
              <span className={iconWrap}>
                <Users size={iconSize} weight={iconWeight} />
              </span>
            </NavLink>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <NavLink
              to="/api"
              title="API usage"
              className={({ isActive }) => getItemClass(isActive, true)}
            >
              <span className={iconWrap}>
                <Database size={iconSize} weight={iconWeight} />
              </span>
            </NavLink>
            <button className={getItemClass(false, true)} title="Trash">
              <span className={iconWrap}>
                <Trash size={iconSize} weight={iconWeight} />
              </span>
            </button>
            <button className={getItemClass(false, true)} title="Settings">
              <span className={iconWrap}>
                <Gear size={iconSize} weight={iconWeight} />
              </span>
            </button>
          </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <NavLink
                to="/inbox"
                title="Inbox"
                className={({ isActive }) => getItemClass(isActive, false)}
              >
                <span className={iconWrap}>
                  <Tray size={iconSize} weight={iconWeight} />
                </span>
                <span>Inbox</span>
              </NavLink>
              <NavLink
                to="/chat"
                title="Chat"
                className={({ isActive }) => getItemClass(isActive, false)}
              >
                <span className={iconWrap}>
                  <ChatCircleText size={iconSize} weight={iconWeight} />
                </span>
                <span>Chat</span>
              </NavLink>
            </div>

            <div className="space-y-2">
              <div className="px-3 text-[11px] uppercase tracking-[0.18em] text-text-tertiary flex items-center justify-between">
                <span>Projects</span>
                <button
                  className="text-text-tertiary hover:text-text-primary"
                  aria-label="Add project"
                >
                  <Plus size={11} />
                </button>
              </div>
              <div className="px-1">
                <button
                  type="button"
                  title="Projects"
                  onClick={() => setProjectExpanded((prev) => !prev)}
                  className={`${getItemClass(false, false)} w-full`}
                  aria-expanded={projectExpanded}
                >
                  <span className={iconWrap}>
                    <Folder size={iconSize} weight={iconWeight} />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="truncate">{activeProject.name}</span>
                    <CaretDown
                      size={12}
                      className={`text-text-tertiary ${projectExpanded ? '' : '-rotate-90'}`}
                    />
                  </div>
                </button>
                {projectExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    <NavLink
                      to="/"
                      end
                      title="Dashboard"
                      className={({ isActive }) => getItemClass(isActive, false)}
                    >
                      <span className={subIconWrap}>
                        <Gauge size={subIconSize} weight={iconWeight} />
                      </span>
                      <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                      to="/agents/table"
                      title="Agent views"
                      className={({ isActive }) => getItemClass(isActive || isAgentsRoute, false)}
                    >
                      <span className={subIconWrap}>
                        <SquaresFour size={subIconSize} weight={iconWeight} />
                      </span>
                      <span>Agent views</span>
                    </NavLink>
                    <NavLink
                      to="/files"
                      title="Files"
                      className={({ isActive }) => getItemClass(isActive, false)}
                    >
                      <span className={subIconWrap}>
                        <Files size={subIconSize} weight={iconWeight} />
                      </span>
                      <span>Files</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <NavLink
                  to="/roles"
                  title="Apprentices"
                  className={({ isActive }) => getItemClass(isActive, false)}
                >
                  <span className={iconWrap}>
                    <Users size={iconSize} weight={iconWeight} />
                  </span>
                  <span>Apprentices</span>
                </NavLink>
              </div>
            </div>

            <div className="mt-auto pt-3">
              <div className="space-y-1">
                <NavLink
                  to="/api"
                  title="API usage"
                  className={({ isActive }) => getItemClass(isActive, false)}
                >
                  <span className={iconWrap}>
                    <Database size={iconSize} weight={iconWeight} />
                  </span>
                  <span>API usage</span>
                </NavLink>
                <button className={getItemClass(false, false)} title="Trash">
                  <span className={iconWrap}>
                    <Trash size={iconSize} weight={iconWeight} />
                  </span>
                  <span>Trash</span>
                </button>
                <button className={getItemClass(false, false)} title="Settings">
                  <span className={iconWrap}>
                    <Gear size={iconSize} weight={iconWeight} />
                  </span>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
