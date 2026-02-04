import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export type RightPanelTabType = 'notes' | 'diff' | 'artifact' | 'chat';

export type RightPanelTab = {
  id: string;
  type: RightPanelTabType;
  title: string;
  closable?: boolean;
  payload?: Record<string, unknown>;
};

type AgentPayload = {
  id: string;
  name: string;
  role?: string;
};

type RightPanelContextValue = {
  tabs: RightPanelTab[];
  activeTabId: string;
  setActiveTab: (id: string) => void;
  openDiff: (file: string) => void;
  openArtifact: (doc: { id?: string; name: string }) => void;
  openChat: (agent: AgentPayload) => void;
  closeTab: (id: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  artifactNotes: Record<string, string>;
  setArtifactNote: (id: string, value: string) => void;
};

const RightPanelContext = createContext<RightPanelContextValue | undefined>(undefined);

const notesTab: RightPanelTab = {
  id: 'notes',
  type: 'notes',
  title: 'Notes',
  closable: false,
};

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<RightPanelTab[]>([notesTab]);
  const [activeTabId, setActiveTabId] = useState<string>('notes');
  const [notes, setNotes] = useState('');
  const [artifactNotes, setArtifactNotes] = useState<Record<string, string>>({});

  const setArtifactNote = (id: string, value: string) => {
    setArtifactNotes(prev => ({ ...prev, [id]: value }));
  };

  const openTab = (tab: RightPanelTab) => {
    setTabs(prev => {
      const existing = prev.find(item => item.id === tab.id);
      if (existing) return prev;
      return [...prev, tab];
    });
    setActiveTabId(tab.id);
  };

  const openDiff = (file: string) => {
    const name = file.split('/').slice(-1)[0] || file;
    openTab({
      id: `diff:${file}`,
      type: 'diff',
      title: name,
      closable: true,
      payload: { file },
    });
  };

  const openArtifact = (doc: { id?: string; name: string }) => {
    const id = doc.id ? `artifact:${doc.id}` : `artifact:${doc.name}`;
    openTab({
      id,
      type: 'artifact',
      title: doc.name,
      closable: true,
      payload: { doc },
    });
  };

  const openChat = (agent: AgentPayload) => {
    openTab({
      id: `chat:${agent.id}`,
      type: 'chat',
      title: agent.name,
      closable: true,
      payload: { agent },
    });
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const next = prev.filter(tab => tab.id !== id);
      if (id === activeTabId) {
        const fallback = next[next.length - 1] ?? notesTab;
        setActiveTabId(fallback.id);
      }
      return next.length === 0 ? [notesTab] : next;
    });
  };

  const value = useMemo(
    () => ({
      tabs,
      activeTabId,
      setActiveTab: setActiveTabId,
      openDiff,
      openArtifact,
      openChat,
      closeTab,
      notes,
      setNotes,
      artifactNotes,
      setArtifactNote,
    }),
    [tabs, activeTabId, notes, artifactNotes]
  );

  return <RightPanelContext.Provider value={value}>{children}</RightPanelContext.Provider>;
}

export function useRightPanel() {
  const context = useContext(RightPanelContext);
  if (!context) {
    throw new Error('useRightPanel must be used within a RightPanelProvider');
  }
  return context;
}
