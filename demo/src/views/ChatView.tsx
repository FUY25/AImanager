import { useMemo, useRef, useState } from 'react';
import { mockAgents, mockProject, mockTasks } from '../data/mockData';
import Avatar from '../components/Avatar';
import {
  MagnifyingGlass,
  Plus,
  PaperPlaneRight,
  Sparkle,
  Pencil,
  Image,
  Check,
  X,
  FunnelSimple,
  ClipboardText,
} from '@phosphor-icons/react';

interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  avatarKind: 'emoji' | 'image';
  status: 'active' | 'busy' | 'idle' | 'blocked';
  project: string;
  role: string;
  topic: string;
  description: string;
  isRouter?: boolean;
}

interface ChatMessage {
  id: string;
  author: 'user' | 'agent';
  body: string;
  time: string;
}

const responseTemplates = [
  'Got it. I can take that on and share progress shortly.',
  'Thanks for the context. Want me to outline a plan before I start?',
  'Copy that. I will spin this up and keep you posted.',
  'I can handle this. Any constraints I should keep in mind?',
];

const routerResponseTemplates = [
  'Share the task brief and I will suggest the best owner. I will ask before assigning.',
  'I can route this by task type or by availability. Want both criteria?',
  'I can draft the task and send recommendations for the right agent.',
  'Give me the goal and constraints, and I will propose a routing plan.',
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const seedMessages = (
  agent: Pick<ChatAgent, 'id' | 'name' | 'avatar' | 'status'>
): ChatMessage[] => [
  {
    id: `${agent.id}-intro`,
    author: 'agent',
    body: `Hey, I'm ${agent.name}. What should I focus on next?`,
    time: '09:12',
  },
  {
    id: `${agent.id}-reply`,
    author: 'user',
    body: 'Review today\'s priority list and flag blockers.',
    time: '09:13',
  },
];

const routerSeedMessages: ChatMessage[] = [
  {
    id: 'router-intro',
    author: 'agent',
    body: 'I can triage new work, suggest the right owner, and draft tasks for you.',
    time: '09:05',
  },
  {
    id: 'router-criteria',
    author: 'agent',
    body: 'Routing basis: task type, dependencies, and current agent availability.',
    time: '09:06',
  },
];

export default function ChatView() {
  const personaMap: Record<string, string> = {
    'agent-1': 'Mika',
    'agent-2': 'Ava',
    'agent-3': 'Dex',
    'agent-4': 'Kai',
  };

  const getPersonaName = (agentId: string, fallback: string) => {
    return personaMap[agentId] || fallback;
  };

  const getRoleName = (agentId: string) => {
    const agent = mockAgents.find(item => item.id === agentId);
    if (!agent) return 'Generalist';
    const capabilityText = agent.capabilities.join(' ').toLowerCase();
    if (capabilityText.includes('ui') || capabilityText.includes('frontend')) return 'Frontend Specialist';
    if (capabilityText.includes('api') || capabilityText.includes('backend')) return 'API Reliability';
    if (capabilityText.includes('testing')) return 'QA Automation';
    if (capabilityText.includes('database')) return 'Data Architect';
    return 'Generalist';
  };

  const getAgentTopic = (agentId: string, role: string) => {
    const agentTasks = mockTasks.filter(task => task.assignedTo === agentId);
    if (agentTasks.length === 0) return role;
    return agentTasks[0].title;
  };

  const getAgentDescription = (agentId: string) => {
    const agentTasks = mockTasks.filter(task => task.assignedTo === agentId);
    if (agentTasks.length === 0) return 'On standby for new assignments.';
    return agentTasks[0].description;
  };

  const routerAgent: ChatAgent = {
    id: 'task-router',
    name: 'Task Router',
    avatar: '/avatars/agent-5.png',
    avatarKind: 'image',
    status: 'active',
    project: mockProject.name,
    role: 'Routing & staffing',
    topic: 'Assignment desk',
    description: 'Routes tasks by type and availability, asks before assigning.',
    isRouter: true,
  };

  const [agents, setAgents] = useState<ChatAgent[]>(
    [
      routerAgent,
      ...mockAgents.map<ChatAgent>(agent => ({
        id: agent.id,
        name: getPersonaName(agent.id, agent.name),
        avatar: agent.avatar,
        avatarKind: agent.avatar.startsWith('/avatars/') ? 'image' : 'emoji',
        status: agent.status,
        project: mockProject.name,
        role: getRoleName(agent.id),
        topic: getAgentTopic(agent.id, getRoleName(agent.id)),
        description: getAgentDescription(agent.id),
      })),
    ]
  );
  const [activeAgentId, setActiveAgentId] = useState<string>(routerAgent.id);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, ChatMessage[]>>(() => {
    const seeded = mockAgents.reduce((acc, agent) => {
      acc[agent.id] = seedMessages({
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        status: agent.status,
      });
      return acc;
    }, {} as Record<string, ChatMessage[]>);
    seeded[routerAgent.id] = routerSeedMessages;
    return seeded;
  });
  const [draft, setDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typingAgentId, setTypingAgentId] = useState<string | null>(null);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAgent = agents.find(agent => agent.id === activeAgentId) || agents[0];
  const isRouterActive = Boolean(activeAgent?.isRouter);
  const activeMessages = messagesByAgent[activeAgentId] ?? [];

  const filteredAgents = useMemo(() => {
    const router = agents.find(agent => agent.isRouter);
    const rest = agents.filter(agent => !agent.isRouter);
    const filtered = searchTerm.trim()
      ? rest.filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : rest;
    return router ? [router, ...filtered] : filtered;
  }, [agents, searchTerm]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || !activeAgent) return;

    const userMessage: ChatMessage = {
      id: `${activeAgent.id}-${Date.now()}-user`,
      author: 'user',
      body: trimmed,
      time: formatTime(new Date()),
    };

    setMessagesByAgent(prev => ({
      ...prev,
      [activeAgent.id]: [...(prev[activeAgent.id] || []), userMessage],
    }));
    setDraft('');
    setTypingAgentId(activeAgent.id);

    window.setTimeout(() => {
      const templatePool = activeAgent.isRouter ? routerResponseTemplates : responseTemplates;
      const reply: ChatMessage = {
        id: `${activeAgent.id}-${Date.now()}-agent`,
        author: 'agent',
        body: templatePool[Math.floor(Math.random() * templatePool.length)],
        time: formatTime(new Date()),
      };

      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgent.id]: [...(prev[activeAgent.id] || []), reply],
      }));
      setTypingAgentId(null);
    }, 700);
  };

  const handleNewAgent = () => {
    const nextIndex = agents.length + 1;
    const newAgent: ChatAgent = {
      id: `agent-${Date.now()}`,
      name: `New Agent ${nextIndex}`,
      avatar: 'AI',
      avatarKind: 'emoji',
      status: 'idle',
      project: mockProject.name,
      role: 'Generalist',
      topic: 'Generalist',
      description: 'Ready to help with next priority.',
    };

    setAgents(prev => {
      const router = prev.find(agent => agent.isRouter);
      const rest = prev.filter(agent => !agent.isRouter);
      return router ? [router, newAgent, ...rest] : [newAgent, ...prev];
    });
    setMessagesByAgent(prev => ({
      ...prev,
      [newAgent.id]: [
        {
          id: `${newAgent.id}-intro`,
          author: 'agent',
          body: 'Hi! I am ready to join the workspace. What should I help with?',
          time: formatTime(new Date()),
        },
      ],
    }));
    setActiveAgentId(newAgent.id);
  };

  const startEditAgent = () => {
    if (!activeAgent || activeAgent.isRouter) return;
    setEditingAgentId(activeAgent.id);
    setNameDraft(activeAgent.name);
  };

  const cancelEditAgent = () => {
    setEditingAgentId(null);
    setNameDraft('');
  };

  const saveAgentEdits = () => {
    if (!activeAgent || activeAgent.isRouter) return;
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    setAgents(prev =>
      prev.map(agent =>
        agent.id === activeAgent.id
          ? {
              ...agent,
              name: trimmed,
            }
          : agent
      )
    );
    cancelEditAgent();
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeAgent || activeAgent.isRouter) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setAgents(prev =>
          prev.map(agent =>
            agent.id === activeAgent.id
              ? {
                  ...agent,
                  avatar: result,
                  avatarKind: 'image',
                }
              : agent
          )
        );
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full min-h-0">
      <aside className="w-72 border-r border-border bg-bg-tertiary flex flex-col h-full">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-text-tertiary">Workspace Chat</div>
              <div className="text-sm font-semibold text-text-primary">Agents</div>
            </div>
            <button
              onClick={handleNewAgent}
              className="p-2 rounded-md bg-bg-elevated border border-border text-text-secondary hover:text-text-primary"
              aria-label="Open a new agent"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-bg-elevated border border-border rounded-md px-3 py-1.5">
            <MagnifyingGlass size={14} className="text-text-tertiary" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Search agents"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-2 space-y-1">
          {filteredAgents.map(agent => {
            const agentMessages = messagesByAgent[agent.id] || [];
            const lastMessage = agentMessages[agentMessages.length - 1];
            const isActive = agent.id === activeAgentId;
            const isRouter = Boolean(agent.isRouter);
            const statusLabel = agent.isRouter
              ? 'Router'
              : agent.status === 'active'
                ? 'Active'
                : agent.status === 'busy'
                  ? 'Busy'
                  : agent.status === 'blocked'
                    ? 'Blocked'
                    : 'Idle';

            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgentId(agent.id)}
                className={[
                  'w-full text-left px-3 py-1.5 rounded-md border transition-colors',
                  isRouter
                    ? isActive
                      ? 'border-accent-300 bg-gradient-to-r from-accent-50/80 to-bg-elevated shadow-soft'
                      : 'border-accent-200/70 bg-gradient-to-r from-accent-50/60 to-transparent hover:from-accent-50/80'
                    : isActive
                      ? 'bg-bg-elevated border-border shadow-soft'
                      : 'border-transparent hover:bg-bg-elevated/70',
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={agent.avatarKind === 'image' ? agent.avatar : undefined}
                    alt={agent.name}
                    fallback={agent.avatar}
                    className="w-9 h-9 rounded-full shadow-[0_10px_18px_rgba(40,35,28,0.18)]"
                    textClassName="text-sm"
                    ring
                    presence
                    presenceStatus={agent.status}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary truncate">
                        {agent.name} · {agent.topic}
                      </span>
                      <span className="text-xs text-text-tertiary">{statusLabel}</span>
                    </div>
                    <div className="text-xs text-text-tertiary truncate">
                      {agent.project} · {agent.role}
                    </div>
                    <div className="text-xs text-text-tertiary truncate">
                      {agent.description || lastMessage?.body || 'No messages yet'}
                    </div>
                    {isRouter && (
                      <div className="mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-accent-700">
                        <span className="w-4 h-4 rounded-full border border-accent-400 bg-bg-elevated text-[9px] font-semibold flex items-center justify-center">
                          R
                        </span>
                        Router desk
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-bg-secondary min-h-0">
        <div className="border-b border-border bg-bg-elevated px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={activeAgent?.avatarKind === 'image' ? activeAgent?.avatar : undefined}
              alt={activeAgent?.name}
              fallback={activeAgent?.avatar || 'A'}
              className="w-10 h-10 rounded-full shadow-[0_12px_20px_rgba(40,35,28,0.2)]"
              textClassName="text-lg"
              ring
              presence={Boolean(activeAgent)}
              presenceStatus={activeAgent?.status || 'active'}
            />
            <div>
              <div className="text-base font-semibold text-text-primary">{activeAgent?.name}</div>
              <div className="text-xs text-text-tertiary">
                {isRouterActive ? 'Routing console · Ask before assigning' : 'Direct session · Live'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRouterActive ? (
              <>
                <button className="flex items-center gap-2 text-sm px-3 py-1.5 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary">
                  <FunnelSimple size={14} />
                  Routing rules
                </button>
                <button className="flex items-center gap-2 text-sm px-3 py-1.5 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary">
                  <ClipboardText size={14} />
                  Create task
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEditAgent}
                  className="flex items-center gap-2 text-sm px-3 py-1.5 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary"
                >
                  <Pencil size={14} />
                  Edit agent
                </button>
                <button className="flex items-center gap-2 text-sm px-3 py-1.5 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary">
                  <Sparkle size={14} />
                  Auto-brief
                </button>
              </>
            )}
          </div>
        </div>

        {editingAgentId === activeAgentId && activeAgent && (
          <div className="border-b border-border bg-bg-tertiary px-6 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-bg-elevated border border-border rounded-md px-3 py-2">
              <input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                className="bg-transparent text-xs text-text-primary focus:outline-none"
                placeholder="Agent name"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs px-3 py-2 bg-bg-elevated border border-border rounded-md text-text-secondary hover:text-text-primary"
            >
              <Image size={14} />
              Upload avatar
            </button>
            <button
              type="button"
              onClick={saveAgentEdits}
              className="flex items-center gap-2 text-xs px-3 py-2 bg-brand text-white rounded-md"
            >
              <Check size={14} />
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditAgent}
              className="flex items-center gap-2 text-xs px-3 py-2 bg-bg-elevated border border-border rounded-md text-text-secondary hover:text-text-primary"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        )}

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-auto px-6 py-5 space-y-4 bg-bg-elevated">
              {activeMessages.map(message => {
                const isUser = message.author === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={[
                        'max-w-[70%] rounded-lg px-4 py-3 text-xs shadow-soft',
                        isUser
                          ? 'bg-brand text-white'
                          : 'bg-bg-elevated border border-border text-text-primary',
                      ].join(' ')}
                    >
                      <div className="leading-relaxed">{message.body}</div>
                      <div
                        className={`mt-2 text-xs ${isUser ? 'text-white/70' : 'text-text-tertiary'}`}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              {typingAgentId === activeAgentId && (
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-text-tertiary animate-pulse" />
                  {activeAgent?.name} is typing...
                </div>
              )}
            </div>

            <div className="border-t border-border bg-bg-elevated px-6 py-4">
              <form
                className="flex items-center gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSend();
                }}
              >
                <div className="flex-1 bg-bg-tertiary border border-border rounded-md px-3 py-2">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={
                      isRouterActive ? 'Describe the task you want to route...' : 'Message your agent...'
                    }
                    rows={1}
                    className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-brand text-white text-xs rounded-md flex items-center gap-2 disabled:opacity-50"
                  disabled={!draft.trim()}
                >
                  <PaperPlaneRight size={14} />
                  Send
                </button>
              </form>
            </div>
          </div>

          {isRouterActive && (
            <aside className="w-80 border-l border-border bg-bg-secondary px-4 py-5 space-y-5 overflow-auto">
              <div>
                <div className="text-xs uppercase tracking-wide text-text-tertiary">Task Router</div>
                <div className="text-sm font-semibold text-text-primary">Routing desk</div>
              </div>

              <div className="rounded-lg border border-border bg-bg-elevated p-3 text-xs space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-tertiary">Routing basis</span>
                  <span className="text-text-primary">Task type + availability</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-tertiary">Assignment mode</span>
                  <span className="text-text-primary">Ask before assigning</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-tertiary">Scope</span>
                  <span className="text-text-primary">Project-wide tasks</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-text-tertiary">Suggested owners</div>
                <div className="space-y-2">
                  {agents
                    .filter(agent => !agent.isRouter)
                    .slice(0, 3)
                    .map((agent, index) => {
                      const matchLine =
                        index === 0
                          ? 'Best match for backend + testing'
                          : index === 1
                            ? 'Strong UI + documentation coverage'
                            : 'Available for reviews + refactors';
                      return (
                        <div
                          key={agent.id}
                          className="rounded-md border border-border bg-bg-elevated px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={agent.avatarKind === 'image' ? agent.avatar : undefined}
                              alt={agent.name}
                              fallback={agent.avatar}
                              className="w-8 h-8 rounded-full"
                              textClassName="text-xs"
                              ring
                              presence
                              presenceStatus={agent.status}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-text-primary truncate">
                                {agent.name}
                              </div>
                              <div className="text-xs text-text-tertiary truncate">{matchLine}</div>
                            </div>
                            <button className="text-xs px-2.5 py-1 border border-border rounded-md text-text-secondary hover:text-text-primary">
                              Request
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-text-tertiary">Draft new task</div>
                <div className="rounded-lg border border-border bg-bg-elevated p-3 space-y-3 text-xs">
                  <input
                    className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
                    placeholder="Task title"
                  />
                  <div className="flex items-center gap-2">
                    <select className="flex-1 bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none">
                      <option>Task type</option>
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Testing</option>
                      <option>Documentation</option>
                    </select>
                    <button className="px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary">
                      Route
                    </button>
                  </div>
                  <button className="w-full px-3 py-2 bg-brand text-white rounded-md text-xs">
                    Ask router to propose owners
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
