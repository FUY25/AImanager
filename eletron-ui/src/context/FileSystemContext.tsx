import { createContext, useContext, useMemo, useState } from 'react';
import { FileNode, PermissionLevel, fileTree } from '../data/mockFiles';

type PermissionSetting = PermissionLevel | 'inherit';

interface FileSystemContextValue {
  permissionOverrides: Record<string, PermissionLevel>;
  setPermission: (id: string, value: PermissionSetting) => void;
  getExplicitPermission: (id: string) => PermissionLevel | undefined;
  getEffectivePermissionForPath: (path: FileNode[]) => PermissionLevel;
}

const FileSystemContext = createContext<FileSystemContextValue | null>(null);

const buildPermissionMap = (node: FileNode, map: Record<string, PermissionLevel>) => {
  if (node.permission) {
    map[node.id] = node.permission;
  }
  if (!node.children) return;
  node.children.forEach(child => buildPermissionMap(child, map));
};

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [permissionOverrides, setPermissionOverrides] = useState<Record<string, PermissionLevel>>(
    () => {
      const map: Record<string, PermissionLevel> = {};
      buildPermissionMap(fileTree, map);
      return map;
    }
  );

  const setPermission = (id: string, value: PermissionSetting) => {
    setPermissionOverrides(prev => {
      const next = { ...prev };
      if (value === 'inherit') {
        delete next[id];
      } else {
        next[id] = value;
      }
      return next;
    });
  };

  const getExplicitPermission = (id: string) => permissionOverrides[id];

  const getEffectivePermissionForPath = (path: FileNode[]) => {
    let effective: PermissionLevel = 'write';
    path.forEach(node => {
      const explicit = permissionOverrides[node.id];
      if (explicit) {
        effective = explicit;
      }
    });
    return effective;
  };

  const value = useMemo(
    () => ({
      permissionOverrides,
      setPermission,
      getExplicitPermission,
      getEffectivePermissionForPath,
    }),
    [permissionOverrides]
  );

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
}

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within FileSystemProvider');
  }
  return context;
};
