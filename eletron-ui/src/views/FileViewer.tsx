import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fileTree,
  findNodeById,
  findPathToId,
  FileNode,
  PermissionLevel,
} from '../data/mockFiles';
import { useFileSystem } from '../context/FileSystemContext';
import {
  ArrowLeft,
  DownloadSimple,
  ShareNetwork,
  Lock,
  CaretLeft,
  CaretRight,
  Image,
} from '@phosphor-icons/react';

type PreviewType = 'markdown' | 'code' | 'image' | 'csv' | 'pdf' | 'text';

const getPreviewType = (name: string): PreviewType => {
  const lower = name.toLowerCase();
  if (lower.endsWith('.md')) return 'markdown';
  if (lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.js')) return 'code';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.pdf')) return 'pdf';
  return 'text';
};

const permissionLabel: Record<PermissionLevel, string> = {
  read: 'Readable',
  write: 'Writable',
  none: 'No access',
};

const parseCsv = (content: string) => {
  const rows = content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split(','));
  if (rows.length === 0) return { headers: [], rows: [] };
  const [headers, ...dataRows] = rows;
  return { headers, rows: dataRows };
};

const renderDocShell = (children: React.ReactNode) => {
  return (
    <div className="bg-bg-elevated border border-border/70 rounded-[28px] shadow-soft p-12 min-h-[60vh]">
      {children}
    </div>
  );
};

const renderCodeEditor = (content: string) => {
  const lines = content.split('\n');
  return (
    <div className="rounded-2xl overflow-hidden border border-primary-800 bg-primary-900 shadow-strong">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-primary-800 bg-primary-800/60 text-xs text-primary-200">
        <span className="w-2 h-2 rounded-full bg-error/90" />
        <span className="w-2 h-2 rounded-full bg-accent-400" />
        <span className="w-2 h-2 rounded-full bg-success" />
        <span className="ml-2">Editor</span>
      </div>
      <div className="grid grid-cols-[52px_1fr] text-xs font-mono leading-relaxed">
        <div className="bg-primary-800/50 text-primary-400 text-right pr-3 py-4 select-none">
          {lines.map((_, index) => (
            <div key={`line-${index}`}>{index + 1}</div>
          ))}
        </div>
        <pre className="text-primary-100 whitespace-pre-wrap px-4 py-4">
          {content || '// No content available'}
        </pre>
      </div>
    </div>
  );
};

const renderContent = (file: FileNode, previewType: PreviewType) => {
  const content = file.content || '';

  if (previewType === 'code') {
    return renderCodeEditor(content);
  }

  if (previewType === 'image') {
    return renderDocShell(
      <div className="text-center space-y-3">
        <div className="w-56 h-36 rounded-xl bg-gradient-to-br from-primary-200 via-primary-100 to-primary-50 flex items-center justify-center border border-border mx-auto">
          <Image size={28} className="text-text-tertiary" />
        </div>
        <div className="text-xs text-text-tertiary">Preview unavailable · mock image</div>
      </div>
    );
  }

  if (previewType === 'csv') {
    const { headers, rows } = parseCsv(content);
    return renderDocShell(
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-bg-tertiary">
            <tr>
              {headers.map((header, index) => (
                <th key={`${header}-${index}`} className="px-4 py-2 text-left text-text-tertiary">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-bg-elevated">
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-border">
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-2 text-text-secondary">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (previewType === 'pdf') {
    return renderDocShell(
      <div className="text-center text-sm text-text-secondary">
        PDF preview is not available in this mock viewer.
      </div>
    );
  }

  return renderDocShell(
    <div className="text-sm text-text-secondary leading-7 whitespace-pre-wrap">
      {content || 'No preview content available.'}
    </div>
  );
};

export default function FileViewer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getExplicitPermission, getEffectivePermissionForPath } = useFileSystem();
  const [detailsOpen, setDetailsOpen] = useState(true);

  const file = id ? findNodeById(fileTree, id) : null;
  const path = useMemo(() => (id ? findPathToId(fileTree, id) : null), [id]);

  if (!file || !path) {
    return (
      <div className="flex-1 p-6">
        <button
          className="text-xs px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary"
          onClick={() => navigate('/files')}
        >
          Back to files
        </button>
        <div className="mt-6 text-sm text-text-tertiary">File not found.</div>
      </div>
    );
  }

  if (file.type === 'folder') {
    return (
      <div className="flex-1 p-6">
        <button
          className="text-xs px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary"
          onClick={() => navigate('/files')}
        >
          Back to files
        </button>
        <div className="mt-6 text-sm text-text-tertiary">This item is a folder.</div>
      </div>
    );
  }

  const previewType = getPreviewType(file.name);
  const effectivePermission = getEffectivePermissionForPath(path);
  const explicitPermission = getExplicitPermission(file.id);
  const pathLabel = path.map(node => node.name).join(' / ');
  const permissionNote = explicitPermission ? 'Explicit' : 'Inherited';

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-bg-secondary">
      <div className="sticky top-0 z-10 border-b border-border bg-bg-elevated/95 backdrop-blur px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary"
            aria-label="Back to files"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-text-primary truncate">{file.name}</div>
            <div className="text-xs text-text-tertiary truncate">{pathLabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-xs px-3 py-2 bg-brand hover:bg-brand/90 text-white rounded-md">
            <ShareNetwork size={14} />
            Share
          </button>
          <button className="flex items-center gap-2 text-xs px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary">
            <DownloadSimple size={14} />
            Download
          </button>
          <button
            onClick={() => setDetailsOpen(prev => !prev)}
            className="flex items-center gap-2 text-xs px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary"
          >
            {detailsOpen ? <CaretRight size={14} /> : <CaretLeft size={14} />}
            {detailsOpen ? 'Hide details' : 'Show details'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full px-6 py-8">
          <div
            className={[
              'grid gap-6',
              detailsOpen ? 'grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]' : 'grid-cols-1',
            ].join(' ')}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                <span className="px-2 py-1 rounded-full bg-bg-tertiary border border-border">
                  {file.kind || 'File'}
                </span>
                <span className="px-2 py-1 rounded-full bg-bg-tertiary border border-border">
                  {file.size || '—'}
                </span>
                <span className="px-2 py-1 rounded-full bg-bg-tertiary border border-border">
                  Updated {file.modified || '--'}
                </span>
                <span className="px-2 py-1 rounded-full bg-bg-tertiary border border-border">
                  Owner: {file.owner || '—'}
                </span>
              </div>

              {effectivePermission === 'none' && (
                <div className="flex items-center gap-2 text-xs text-text-tertiary bg-bg-tertiary border border-border rounded-md px-3 py-2">
                  <Lock size={12} />
                  Agents cannot access this file.
                </div>
              )}

              {renderContent(file, previewType)}
            </div>

            {detailsOpen && (
              <aside className="space-y-4">
                <div className="bg-bg-elevated border border-border rounded-lg p-4">
                  <div className="text-xs uppercase tracking-wide text-text-tertiary mb-3">
                    Agent access
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {permissionLabel[effectivePermission]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-bg-tertiary text-text-tertiary">
                      {permissionNote}
                    </span>
                  </div>
                  <div className="text-xs text-text-tertiary mt-2">
                    Permissions are managed in the file list.
                  </div>
                </div>

                <div className="bg-bg-elevated border border-border rounded-lg p-4">
                  <div className="text-xs uppercase tracking-wide text-text-tertiary mb-3">
                    File details
                  </div>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div className="flex items-center justify-between">
                      <span>Type</span>
                      <span className="text-text-primary">{file.kind || 'File'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Owner</span>
                      <span className="text-text-primary">{file.owner || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Modified</span>
                      <span className="text-text-primary">{file.modified || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Size</span>
                      <span className="text-text-primary">{file.size || '--'}</span>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
