export type AgentType = 'claude' | 'gemini' | 'codex' | 'cursor';
export type AgentStatus = 'active' | 'busy' | 'blocked' | 'idle';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | 'canceled';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'paused' | 'completed';
export type RiskFlag = 'stuck' | 'failing' | 'needs_review';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  avatar: string;
  status: AgentStatus;
  health: number;
  capabilities: string[];
  currentTasks: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string | null;
  dependencies: string[];
  blocks: string[];
  progress: number;
  riskFlags: RiskFlag[];
  changedFiles: string[];
  diffAdd: number;
  diffDel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: Task[];
  agents: Agent[];
}

export interface ApiError {
  timestamp: Date;
  modelId: string;
  errorType: string;
  message: string;
}

export interface ApiUsage {
  modelId: string;
  modelName: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  avgLatency: number;
  successRate: number;
  errors: ApiError[];
}

export interface UsageDataPoint {
  date: string;
  claude: number;
  gemini: number;
  codex: number;
}

export interface ProjectDoc {
  id: string;
  name: string;
  updatedAtLabel: string;
}

export interface ProjectUpdate {
  id: string;
  summary: string;
  agentId: string;
  time: string;
  filesChanged: string[];
}
