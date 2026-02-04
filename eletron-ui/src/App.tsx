import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LeftSidebar from './components/layout/LeftSidebar';
import TopNav from './components/layout/TopNav';
import ViewTabs from './components/layout/ViewTabs';
import ProjectHeader from './components/layout/ProjectHeader';
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

function AppLayout() {
  const location = useLocation();
  const showAgentTabs = location.pathname.startsWith('/agents');
  const hideProjectHeader =
    location.pathname === '/api' ||
    location.pathname === '/inbox' ||
    location.pathname === '/chat' ||
    location.pathname === '/roles';

  return (
    <div className="min-h-screen flex bg-bg-secondary">
      <LeftSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hideProjectHeader && (
            <div className="px-6 pt-4">
              <ProjectHeader />
            </div>
          )}
          {showAgentTabs && <ViewTabs />}
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
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <FileSystemProvider>
        <AppLayout />
      </FileSystemProvider>
    </Router>
  );
}
