import type { MouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GitDiff,
  NotePencil,
  FileText,
  Terminal,
  ChatCircleText,
  X,
} from '@phosphor-icons/react';
import { mockDocs } from '../../data/mockData';
import { RightPanelTab, useRightPanel } from '../../context/RightPanelContext';

type RightPanelProps = {
  width: number;
};

const artifacts = mockDocs.filter((doc) => doc.name.toLowerCase().endsWith('.md'));

export default function RightPanel({ width }: RightPanelProps) {
  const {
    tabs,
    activeTabId,
    setActiveTab,
    closeTab,
    notes,
    setNotes,
    artifactNotes,
    setArtifactNote,
  } = useRightPanel();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(160);
  const dragRef = useRef({ active: false, startY: 0, startHeight: 160 });
  const [chatState, setChatState] = useState<
    Record<string, { draft: string; messages: { from: 'user' | 'agent'; text: string }[] }>
  >({});

  const activeTab = tabs.find(tab => tab.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!dragRef.current.active) return;
      const delta = event.clientY - dragRef.current.startY;
      const nextHeight = Math.min(
        320,
        Math.max(120, dragRef.current.startHeight - delta)
      );
      setTerminalHeight(nextHeight);
    };

    const handleUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
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
    dragRef.current = {
      active: true,
      startY: event.clientY,
      startHeight: terminalHeight,
    };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const diffLines = useMemo(() => {
    const file = (activeTab?.payload?.file as string | undefined) ?? 'file';
    return [
      { type: 'meta', text: `diff --git a/${file} b/${file}` },
      { type: 'meta', text: '@@ -12,8 +12,10 @@' },
      { type: 'remove', text: '-const status = "pending";' },
      { type: 'add', text: '+const status = "active";' },
      { type: 'add', text: '+const owner = agentId ?? "unassigned";' },
      { type: 'context', text: ' export function updateTask() {' },
    ];
  }, [activeTab]);

  const getTabIcon = (tab: RightPanelTab) => {
    switch (tab.type) {
      case 'diff':
        return GitDiff;
      case 'notes':
        return NotePencil;
      case 'artifact':
        return FileText;
      case 'chat':
        return ChatCircleText;
      default:
        return NotePencil;
    }
  };

  return (
    <aside
      className="border-l border-border bg-bg-secondary flex flex-col h-full min-w-[240px] flex-shrink-0"
      style={{ width }}
    >
      <div className="flex items-center justify-between px-3 h-9 border-b border-border/70">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = getTabIcon(tab);
            const isActive = activeTab?.id === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-colors max-w-[150px]',
                  isActive
                    ? 'bg-bg-tertiary text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                ].join(' ')}
              >
                <Icon size={12} weight="light" />
                <span className="truncate">{tab.title}</span>
                {tab.closable && (
                  <span
                    role="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="ml-1 text-text-tertiary hover:text-text-primary"
                  >
                    <X size={10} weight="bold" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setTerminalOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-text-tertiary hover:text-text-primary"
          title="Toggle terminal"
        >
          <Terminal size={12} weight="light" />
          Terminal
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto p-3">
          {activeTab?.type === 'diff' && (
            <div className="space-y-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                  Diff View
                </div>
                <div className="text-sm font-semibold text-text-primary">
                  {(activeTab.payload?.file as string | undefined) ?? 'Select a file change'}
                </div>
                {!activeTab.payload?.file && (
                  <div className="text-xs text-text-tertiary mt-1">
                    Click a file chip in the table to preview its diff.
                  </div>
                )}
              </div>
              {activeTab.payload?.file && (
                <div className="rounded-md border border-border bg-bg-elevated p-3 font-mono text-[11px] space-y-1">
                  {diffLines.map((line, index) => (
                    <div
                      key={`${line.text}-${index}`}
                      className={[
                        'whitespace-pre-wrap',
                        line.type === 'add'
                          ? 'text-success'
                          : line.type === 'remove'
                            ? 'text-error'
                            : 'text-text-tertiary',
                      ].join(' ')}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab?.type === 'notes' && (
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                Project Scratchpad
              </div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full min-h-[260px] bg-bg-elevated border border-border rounded-md p-3 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
                placeholder="Quick notes, reminders, and decisions..."
              />
            </div>
          )}

          {activeTab?.type === 'artifact' && (
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                Artifact Viewer
              </div>
              {(() => {
                const doc = activeTab.payload?.doc as { id?: string; name: string } | undefined;
                const fallback = artifacts[0];
                const displayDoc = doc ?? fallback;
                if (!displayDoc) {
                  return (
                    <div className="text-xs text-text-tertiary">
                      No markdown artifacts found yet.
                    </div>
                  );
                }
                const docId = displayDoc.id ?? displayDoc.name;
                return (
                  <div className="rounded-md border border-border bg-bg-elevated p-3 space-y-2">
                    <div className="text-sm font-semibold text-text-primary">
                      {displayDoc.name}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {'updatedAtLabel' in displayDoc
                        ? (displayDoc.updatedAtLabel as string)
                        : 'Markdown document'}
                    </div>
                    <input
                      value={artifactNotes[docId] ?? ''}
                      onChange={(event) => setArtifactNote(docId, event.target.value)}
                      className="w-full bg-bg-tertiary border border-border rounded-md px-2 py-1 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
                      placeholder="Add a comment..."
                    />
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab?.type === 'chat' && (
            <div className="flex flex-col h-full min-h-[260px]">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                Agent Chat
              </div>
              <div className="text-sm font-semibold text-text-primary mt-1">
                {(activeTab.payload?.agent as { name?: string } | undefined)?.name ?? 'Agent'}
              </div>
              <div className="mt-3 flex-1 space-y-2 overflow-auto">
                {(chatState[activeTab.id]?.messages ?? []).map((message, index) => (
                  <div
                    key={`${message.text}-${index}`}
                    className={[
                      'rounded-md px-3 py-2 text-xs max-w-[85%]',
                      message.from === 'user'
                        ? 'bg-brand/15 text-text-primary ml-auto'
                        : 'bg-bg-elevated text-text-secondary',
                    ].join(' ')}
                  >
                    {message.text}
                  </div>
                ))}
                {(chatState[activeTab.id]?.messages ?? []).length === 0 && (
                  <div className="text-xs text-text-tertiary">
                    Start a quick thread with this agent.
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={chatState[activeTab.id]?.draft ?? ''}
                  onChange={(event) =>
                    setChatState(prev => ({
                      ...prev,
                      [activeTab.id]: {
                        messages: prev[activeTab.id]?.messages ?? [],
                        draft: event.target.value,
                      },
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    const draft = chatState[activeTab.id]?.draft?.trim();
                    if (!draft) return;
                    setChatState(prev => ({
                      ...prev,
                      [activeTab.id]: {
                        draft: '',
                        messages: [
                          ...(prev[activeTab.id]?.messages ?? []),
                          { from: 'user', text: draft },
                        ],
                      },
                    }));
                  }}
                  className="flex-1 bg-bg-tertiary border border-border rounded-md px-2 py-1 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  placeholder="Send a quick message..."
                />
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md bg-brand text-white text-xs"
                  onClick={() => {
                    const draft = chatState[activeTab.id]?.draft?.trim();
                    if (!draft) return;
                    setChatState(prev => ({
                      ...prev,
                      [activeTab.id]: {
                        draft: '',
                        messages: [
                          ...(prev[activeTab.id]?.messages ?? []),
                          { from: 'user', text: draft },
                        ],
                      },
                    }));
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {terminalOpen && (
          <>
            <div
              className="h-2 cursor-row-resize border-t border-border/70 bg-bg-secondary"
              onMouseDown={startResize}
            />
            <div
              className="border-t border-border/70 bg-bg-elevated px-3 py-2"
              style={{ height: terminalHeight }}
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                Terminal
              </div>
              <div className="mt-2 font-mono text-[11px] text-text-tertiary">
                $ tail -f session.log
              </div>
              <div className="mt-1 font-mono text-[11px] text-text-tertiary">
                ↳ waiting for tasks...
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
