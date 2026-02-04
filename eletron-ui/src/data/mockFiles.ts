export type PermissionLevel = 'read' | 'write' | 'none';

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  kind?: string;
  size?: string;
  modified?: string;
  owner?: string;
  permission?: PermissionLevel;
  content?: string;
  children?: FileNode[];
}

const agentCardContent = `import { Agent } from '../types';

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="agent-card">
      <div className="agent-card__avatar">{agent.avatar}</div>
      <div className="agent-card__meta">
        <strong>{agent.name}</strong>
        <span>{agent.status}</span>
      </div>
    </div>
  );
}
`;

const taskListContent = `import { Task } from '../types';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <span>{task.title}</span>
          <em>{task.status}</em>
        </li>
      ))}
    </ul>
  );
}
`;

const useAgentsContent = `import { useMemo } from 'react';
import { Agent } from '../types';

export function useAgents(agents: Agent[]) {
  return useMemo(() => {
    const active = agents.filter(agent => agent.status === 'active');
    const blocked = agents.filter(agent => agent.status === 'blocked');
    return { active, blocked };
  }, [agents]);
}
`;

const tokensCssContent = `:root {
  --bg: #f7f7f5;
  --panel: #ffffff;
  --border: #e6e6e3;
  --text: #2f2e2a;
  --text-secondary: #6f6c66;
  --accent: #4a7fe0;
}
`;

const readmeContent = `# E-commerce Platform Rebuild

This workspace contains the UI, API, and infrastructure work for the new
authentication system. The goal is to provide a secure, low-friction login
experience while keeping the agent loops fast.

## Quick links
- /project/src for frontend code
- /project/database for schema work
- /project/outputs for release notes
`;

const productSpecContent = `# Product Spec — Auth Foundations

## Goals
- Reduce login drop-off by 18%
- Support Google + GitHub OAuth
- Ship MVP in 3 weeks

## Scope
We will ship a full auth stack: UI, API, database, and monitoring. Tasks are
tracked at a high level (3–30 minute execution threads) for each agent.
`;

const sessionBriefContent = `# Session Brief

Today we are focused on: API reliability and UI consistency. Agents should
prioritize tasks with risk flags and unblock database work.
`;

const releaseSummaryContent = `# Release Summary

## Shipped
- OAuth integration (Google + GitHub)
- Session token refresh

## Notes
Database schema is blocked pending API agreement.
`;

const standardsContent = `# Standards

- All agent outputs must include file paths and reasoning.
- Share blockers within 10 minutes of discovery.
`;

const policiesContent = `# Policies

Agents cannot access files marked as "No access". They may read files marked
as "Readable" and write only to "Writable" resources.
`;

const skillsJsonContent = `{
  "skills": [
    { "name": "frontend-design", "version": "1.0.0" },
    { "name": "skill-installer", "version": "1.0.0" }
  ]
}
`;

const mcpsJsonContent = `{
  "servers": [
    { "name": "files", "status": "connected" },
    { "name": "tasks", "status": "connected" }
  ]
}
`;

const colorTokensCsvContent = `token,value
brand-500,#4a7fe0
brand-600,#3567c8
neutral-100,#f1f1ef
neutral-900,#1f1e1b
`;

const schemaSqlContent = `CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
`;

export const projectNode: FileNode = {
  id: 'project-project-1',
  name: 'E-commerce Platform Rebuild',
  type: 'folder',
  permission: 'write',
  children: [
    {
      id: 'project-folder',
      name: 'project',
      type: 'folder',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          permission: 'write',
          children: [
            {
              id: 'components',
              name: 'components',
              type: 'folder',
              children: [
                {
                  id: 'component-1',
                  name: 'AgentCard.tsx',
                  type: 'file',
                  kind: 'TypeScript React',
                  size: '5 KB',
                  modified: 'Jan 29, 2026',
                  owner: 'Codex',
                  content: agentCardContent,
                },
                {
                  id: 'component-2',
                  name: 'TaskList.tsx',
                  type: 'file',
                  kind: 'TypeScript React',
                  size: '7 KB',
                  modified: 'Jan 29, 2026',
                  owner: 'Claude',
                  content: taskListContent,
                },
              ],
            },
            {
              id: 'hooks',
              name: 'hooks',
              type: 'folder',
              children: [
                {
                  id: 'hook-1',
                  name: 'useAgents.ts',
                  type: 'file',
                  kind: 'TypeScript',
                  size: '3 KB',
                  modified: 'Jan 28, 2026',
                  owner: 'Gemini',
                  content: useAgentsContent,
                },
              ],
            },
            {
              id: 'styles',
              name: 'styles',
              type: 'folder',
              children: [
                {
                  id: 'style-1',
                  name: 'tokens.css',
                  type: 'file',
                  kind: 'CSS',
                  size: '9 KB',
                  modified: 'Jan 27, 2026',
                  owner: 'Fuyu',
                  content: tokensCssContent,
                },
              ],
            },
          ],
        },
        {
          id: 'design',
          name: 'design',
          type: 'folder',
          permission: 'read',
          children: [
            {
              id: 'design-1',
              name: 'Dashboard.png',
              type: 'file',
              kind: 'PNG Image',
              size: '2.2 MB',
              modified: 'Jan 26, 2026',
              owner: 'Mika',
            },
            {
              id: 'design-2',
              name: 'Color Tokens.csv',
              type: 'file',
              kind: 'Spreadsheet',
              size: '48 KB',
              modified: 'Jan 24, 2026',
              owner: 'Ava',
              content: colorTokensCsvContent,
            },
          ],
        },
        {
          id: 'database',
          name: 'database',
          type: 'folder',
          permission: 'read',
          children: [
            {
              id: 'db-1',
              name: 'schema.sql',
              type: 'file',
              kind: 'SQL',
              size: '14 KB',
              modified: 'Jan 23, 2026',
              owner: 'Codex',
              content: schemaSqlContent,
            },
          ],
        },
        {
          id: 'readme',
          name: 'README.md',
          type: 'file',
          kind: 'Markdown Document',
          size: '6 KB',
          modified: 'Jan 28, 2026',
          owner: 'Fuyu',
          content: readmeContent,
        },
      ],
    },
    {
      id: 'project-docs',
      name: 'docs',
      type: 'folder',
      permission: 'read',
      children: [
        {
          id: 'doc-1',
          name: 'Product Spec.md',
          type: 'file',
          kind: 'Markdown Document',
          size: '42 KB',
          modified: 'Jan 28, 2026',
          owner: 'Fuyu',
          content: productSpecContent,
        },
        {
          id: 'doc-2',
          name: 'Auth Flows.pdf',
          type: 'file',
          kind: 'PDF Document',
          size: '1.6 MB',
          modified: 'Jan 27, 2026',
          owner: 'Ava',
          permission: 'none',
        },
      ],
    },
    {
      id: 'project-knowledge',
      name: 'knowledge',
      type: 'folder',
      children: [
        {
          id: 'knowledge-1',
          name: 'session-brief.md',
          type: 'file',
          kind: 'Markdown Document',
          size: '4 KB',
          modified: 'Jan 29, 2026',
          owner: 'Fuyu',
          content: sessionBriefContent,
        },
      ],
    },
    {
      id: 'project-agents',
      name: 'agents',
      type: 'folder',
      children: [
        {
          id: 'agent-1',
          name: 'claude-opus',
          type: 'folder',
          children: [
            {
              id: 'agent-1-profile',
              name: 'agent.md',
              type: 'file',
              kind: 'Markdown Document',
              size: '2 KB',
              modified: 'Jan 28, 2026',
              owner: 'Fuyu',
              content: '## Agent Profile\\n\\nPrimary strengths: UI, documentation, clarity.',
            },
          ],
        },
      ],
    },
    {
      id: 'project-outputs',
      name: 'outputs',
      type: 'folder',
      permission: 'read',
      children: [
        {
          id: 'output-1',
          name: 'release-summary.md',
          type: 'file',
          kind: 'Markdown Document',
          size: '12 KB',
          modified: 'Jan 28, 2026',
          owner: 'Claude',
          content: releaseSummaryContent,
        },
      ],
    },
  ],
};

export const fileTree: FileNode = {
  id: 'workspace',
  name: 'Workspace',
  type: 'folder',
  permission: 'write',
  children: [
    {
      id: 'projects',
      name: 'projects',
      type: 'folder',
      children: [projectNode],
    },
    {
      id: 'apprentices',
      name: 'apprentices',
      type: 'folder',
      children: [
        {
          id: 'apprentice-frontend',
          name: 'frontend-specialist',
          type: 'folder',
          children: [
            {
              id: 'apprentice-frontend-profile',
              name: 'profile.md',
              type: 'file',
              kind: 'Markdown Document',
              size: '6 KB',
              modified: 'Jan 28, 2026',
              owner: 'Fuyu',
              content: '## Frontend Specialist\\n\\nFocus: design systems and accessible UI.',
            },
            {
              id: 'apprentice-frontend-soul',
              name: 'soul.md',
              type: 'file',
              kind: 'Markdown Document',
              size: '2 KB',
              modified: 'Jan 27, 2026',
              owner: 'Fuyu',
              content: 'Short notes on voice and tone for agent replies.',
            },
          ],
        },
      ],
    },
    {
      id: 'skills',
      name: 'skills',
      type: 'folder',
      permission: 'read',
      children: [
        {
          id: 'skills-index',
          name: 'skills.json',
          type: 'file',
          kind: 'JSON',
          size: '4 KB',
          modified: 'Jan 29, 2026',
          owner: 'Fuyu',
          content: skillsJsonContent,
        },
      ],
    },
    {
      id: 'mcps',
      name: 'mcps',
      type: 'folder',
      permission: 'read',
      children: [
        {
          id: 'mcps-index',
          name: 'mcps.json',
          type: 'file',
          kind: 'JSON',
          size: '3 KB',
          modified: 'Jan 29, 2026',
          owner: 'Fuyu',
          content: mcpsJsonContent,
        },
      ],
    },
    {
      id: 'docs',
      name: 'docs',
      type: 'folder',
      permission: 'read',
      children: [
        {
          id: 'doc-standards',
          name: 'standards.md',
          type: 'file',
          kind: 'Markdown Document',
          size: '5 KB',
          modified: 'Jan 26, 2026',
          owner: 'Fuyu',
          content: standardsContent,
        },
      ],
    },
    {
      id: 'system',
      name: 'system',
      type: 'folder',
      permission: 'none',
      children: [
        {
          id: 'system-policy',
          name: 'policies.md',
          type: 'file',
          kind: 'Markdown Document',
          size: '5 KB',
          modified: 'Jan 25, 2026',
          owner: 'Fuyu',
          permission: 'none',
          content: policiesContent,
        },
      ],
    },
  ],
};

export const findPathToId = (
  node: FileNode,
  targetId: string,
  path: FileNode[] = []
): FileNode[] | null => {
  const nextPath = [...path, node];
  if (node.id === targetId) return nextPath;
  if (!node.children) return null;
  for (const child of node.children) {
    const result = findPathToId(child, targetId, nextPath);
    if (result) return result;
  }
  return null;
};

export const findNodeById = (node: FileNode, targetId: string): FileNode | null => {
  if (node.id === targetId) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const result = findNodeById(child, targetId);
    if (result) return result;
  }
  return null;
};
