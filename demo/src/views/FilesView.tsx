import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileTree, projectNode, findPathToId, FileNode, PermissionLevel } from '../data/mockFiles';
import { mockAgents } from '../data/mockData';
import { useFileSystem } from '../context/FileSystemContext';
import {
  CaretRight,
  Folder,
  FileText,
  FileCode,
  Image,
  FileCsv,
  Database,
  MagnifyingGlass,
  HardDrive,
  Clock,
  Star,
  ArrowLeft,
  Plus,
  Lock,
} from '@phosphor-icons/react';
import Avatar from '../components/Avatar';

const getIconForItem = (item: FileNode) => {
  if (item.type === 'folder') return Folder;

  const name = item.name.toLowerCase();
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) return Image;
  if (name.endsWith('.csv') || name.endsWith('.xls')) return FileCsv;
  if (name.endsWith('.sql')) return Database;
  if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js')) return FileCode;
  return FileText;
};

const agentByName = new Map(
  mockAgents.map(agent => [agent.name.toLowerCase(), agent])
);

export default function FilesView() {
  const navigate = useNavigate();
  const { setPermission, getExplicitPermission, getEffectivePermissionForPath } = useFileSystem();
  const initialPath =
    findPathToId(fileTree, projectNode.id) ||
    findPathToId(fileTree, 'projects') ||
    [fileTree];
  const [path, setPath] = useState<FileNode[]>(initialPath);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionFilter, setPermissionFilter] = useState<PermissionLevel | 'all'>('all');

  const currentFolder = path[path.length - 1];
  const items = currentFolder.children || [];

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm]);

  const visibleItems = useMemo(() => {
    if (permissionFilter === 'all') return filteredItems;
    return filteredItems.filter(item => {
      const permission = getEffectivePermissionForPath([...path, item]);
      return permission === permissionFilter;
    });
  }, [filteredItems, getEffectivePermissionForPath, path, permissionFilter]);

  const openFolder = (folder: FileNode) => {
    if (folder.type !== 'folder') return;
    setPath(prev => [...prev, folder]);
  };

  const openItem = (item: FileNode) => {
    if (item.type === 'folder') {
      openFolder(item);
      return;
    }
    navigate(`/files/view/${item.id}`);
  };

  const goToCrumb = (index: number) => {
    setPath(prev => prev.slice(0, index + 1));
  };

  const goUp = () => {
    if (path.length > 1) {
      setPath(prev => prev.slice(0, prev.length - 1));
    }
  };

  const permissionLabel: Record<PermissionLevel, string> = {
    read: 'Readable',
    write: 'Writable',
    none: 'No access',
  };

  const getOwnerAgent = (owner?: string) => {
    if (!owner) return null;
    return agentByName.get(owner.toLowerCase()) || null;
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full min-h-0">
      <aside className="w-64 border-r border-border bg-bg-tertiary px-3 py-4 space-y-5 h-full">
        <div>
          <div className="text-sm uppercase tracking-wide text-text-secondary mb-3 font-semibold">Favorites</div>
          <div className="space-y-2 text-sm">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-bg-elevated border border-border text-text-primary">
              <Star size={14} />
              Project Files
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-text-secondary hover:bg-bg-elevated/70">
              <Clock size={14} />
              Recent
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-text-secondary hover:bg-bg-elevated/70">
              <HardDrive size={14} />
              Storage
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm uppercase tracking-wide text-text-secondary mb-3 font-semibold">Pinned</div>
          <div className="space-y-2 text-sm">
            {fileTree.children?.filter(child => child.type === 'folder').map(folder => (
              <button
                key={folder.id}
                onClick={() => openFolder(folder)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-text-secondary hover:bg-bg-elevated/70"
              >
                <Folder size={14} />
                {folder.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="border-b border-border bg-bg-elevated px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goUp}
              className="p-2 rounded-md bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary disabled:opacity-40"
              disabled={path.length === 1}
              aria-label="Go up"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex items-center text-sm text-text-secondary">
              {path.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center">
                  <button
                    onClick={() => goToCrumb(index)}
                    className="hover:text-text-primary"
                  >
                    {crumb.name}
                  </button>
                  {index < path.length - 1 && (
                    <CaretRight size={14} className="mx-2 text-text-tertiary" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-bg-tertiary border border-border rounded-md px-3 py-2">
              <MagnifyingGlass size={14} className="text-text-tertiary" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-40 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                placeholder="Search folder"
              />
            </div>
            <select
              value={permissionFilter}
              onChange={(event) => setPermissionFilter(event.target.value as PermissionLevel | 'all')}
              className="px-3 py-2 text-sm border border-border rounded bg-bg-tertiary text-text-secondary"
            >
              <option value="all">Agent access: All</option>
              <option value="read">Agent access: Readable</option>
              <option value="write">Agent access: Writable</option>
              <option value="none">Agent access: No access</option>
            </select>
            <button className="flex items-center gap-2 text-sm px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary">
              <Plus size={14} />
              New folder
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-bg-elevated">
          <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_160px_170px] text-sm uppercase tracking-wide text-text-tertiary pb-2 border-b border-border">
            <div>Name</div>
            <div>Kind</div>
            <div>Modified</div>
            <div>Owner</div>
            <div>Agent access</div>
          </div>
          <div className="divide-y divide-border">
            {visibleItems.map(item => {
              const Icon = getIconForItem(item);
              const ownerAgent = getOwnerAgent(item.owner);
              const effectivePermission = getEffectivePermissionForPath([...path, item]);
              const explicitPermission = getExplicitPermission(item.id);
              const isLocked = effectivePermission === 'none';
              return (
                <button
                  key={item.id}
                  onClick={() => openItem(item)}
                  className="w-full grid grid-cols-[minmax(0,1fr)_140px_140px_160px_170px] text-left text-sm text-text-primary py-3 hover:bg-bg-tertiary"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-text-tertiary" />
                    <span className="truncate">{item.name}</span>
                    {isLocked && (
                      <span className="text-text-tertiary" title="Agents cannot access">
                        <Lock size={12} />
                      </span>
                    )}
                  </div>
                  <div className="text-text-secondary">{item.kind || 'Folder'}</div>
                  <div className="text-text-secondary">{item.modified || '--'}</div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    {ownerAgent ? (
                      <>
                        <Avatar
                          src={ownerAgent.avatar}
                          alt={ownerAgent.name}
                          fallback={ownerAgent.name[0]}
                          className="w-7 h-7 rounded-full shadow-[0_6px_12px_rgba(40,35,28,0.14)]"
                          textClassName="text-sm"
                        />
                        <span className="text-text-primary">{ownerAgent.name}</span>
                      </>
                    ) : (
                      <span>{item.owner || '--'}</span>
                    )}
                  </div>
                  <div
                    className="text-text-secondary"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <select
                      value={explicitPermission ?? 'inherit'}
                      onChange={(event) => {
                        const next = event.target.value as PermissionLevel | 'inherit';
                        setPermission(item.id, next);
                      }}
                      className="w-full px-2 py-1 text-sm border border-border rounded bg-bg-tertiary text-text-secondary"
                    >
                      <option value="inherit">
                        Inherit ({permissionLabel[effectivePermission]})
                      </option>
                      <option value="read">Readable</option>
                      <option value="write">Writable</option>
                      <option value="none">No access</option>
                    </select>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
