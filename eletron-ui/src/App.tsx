import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LeftSidebar from './components/layout/LeftSidebar';
import TopNav from './components/layout/TopNav';
import ProjectHeader from './components/layout/ProjectHeader';
import RightPanel from './components/layout/RightPanel';
import DashboardView from './views/DashboardView';
import InboxView from './views/InboxView';
import ChatView from './views/ChatView';
import KanbanView from './views/KanbanView';
import TableView from './views/TableView';
import WhiteboardView from './views/WhiteboardView';
import FilesView from './views/FilesView';
import FileViewer from './views/FileViewer';
import RolesView from './views/RolesView';
import ApiView from './views/ApiView';
import CustomizeView from './views/CustomizeView';
import { FileSystemProvider } from './context/FileSystemContext';
import { RightPanelProvider } from './context/RightPanelContext';

function AppLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const resizeRef = useRef({ active: false, startX: 0, startWidth: 320 });
  const hideProjectHeader =
    location.pathname === '/api' ||
    location.pathname === '/inbox' ||
    location.pathname === '/chat' ||
    location.pathname === '/roles';

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!resizeRef.current.active) return;
      const delta = resizeRef.current.startX - event.clientX;
      const next = Math.min(480, Math.max(260, resizeRef.current.startWidth + delta));
      setRightPanelWidth(next);
    };

    const handleUp = () => {
      if (!resizeRef.current.active) return;
      resizeRef.current.active = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  const startResize = (event: MouseEvent<HTMLDivElement>) => {
    resizeRef.current = {
      active: true,
      startX: event.clientX,
      startWidth: rightPanelWidth,
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="min-h-screen flex bg-bg-secondary">
      <LeftSidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNav
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          onToggleRightPanel={() => setRightPanelOpen((prev) => !prev)}
        />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {!hideProjectHeader && (
              <div className="px-6 pt-2">
                <ProjectHeader />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/inbox" element={<InboxView />} />
                <Route path="/chat" element={<ChatView />} />
                <Route path="/agents/table" element={<TableView />} />
                <Route path="/agents" element={<Navigate to="/agents/table" replace />} />
                <Route path="/agents/kanban" element={<KanbanView />} />
                <Route path="/agents/customize" element={<CustomizeView />} />
                <Route path="/workflow" element={<WhiteboardView />} />
                <Route path="/files" element={<FilesView />} />
                <Route path="/files/view/:id" element={<FileViewer />} />
                <Route path="/roles" element={<RolesView />} />
                <Route path="/api" element={<ApiView />} />
              </Routes>
            </div>
          </div>
          {rightPanelOpen && (
            <>
              <div
                className="w-1 bg-border/70 cursor-col-resize hover:bg-border"
                onMouseDown={startResize}
              />
              <RightPanel width={rightPanelWidth} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <FileSystemProvider>
        <RightPanelProvider>
          <AppLayout />
        </RightPanelProvider>
      </FileSystemProvider>
    </Router>
  );
}
