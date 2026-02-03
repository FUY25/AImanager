# Vibe Kanban Architecture Documentation

## Overview

Vibe Kanban is a task orchestration platform for AI coding agents. It enables developers to:
- Switch between different coding agents (Claude Code, Gemini CLI, Codex, Amp, etc.)
- Orchestrate multiple coding agents in parallel or sequence
- Review work and manage dev servers
- Track task status across coding agents
- Centralize MCP (Model Context Protocol) configurations

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Rust (Axum, Tokio, SQLx) |
| Frontend | React + TypeScript (Vite, Tailwind CSS) |
| Database | SQLite (local), PostgreSQL (remote) |
| Type Sharing | ts-rs (Rust → TypeScript) |
| Package Manager | pnpm |

---

## Project Structure

```
vibe-kanban/
├── crates/              # Rust workspace crates (backend)
├── frontend/            # React + TypeScript app (main UI)
├── remote-frontend/     # Remote deployment frontend
├── shared/              # Generated TypeScript types
├── npx-cli/             # NPM CLI package
├── scripts/             # Development helpers
├── docs/                # Documentation
├── assets/              # Static assets
└── dev_assets_seed/     # Development database seed
```

---

## Backend Crates (`crates/`)

### `server`
**Purpose**: Main API server and binary entry points
- Handles HTTP API routes
- WebSocket connections for real-time updates
- Serves the frontend static files
- Entry point for the application

### `db`
**Purpose**: Database models and migrations (SQLx)
- **Models**: `project.rs`, `task.rs`, `workspace.rs`, `repo.rs`, `session.rs`
- Handles CRUD operations for projects, tasks, execution processes
- SQLx compile-time checked queries

### `executors`
**Purpose**: Coding agent integrations and execution management
- **Supported Agents**:
  - `claude.rs` - Claude Code integration
  - `gemini.rs` - Gemini CLI integration
  - `codex.rs` - OpenAI Codex integration
  - `amp.rs` - Amp integration
  - `cursor.rs` - Cursor integration
  - `copilot.rs` - GitHub Copilot integration
  - `opencode.rs` - OpenCode integration
  - `qwen.rs` - Qwen integration
  - `droid.rs` - Droid integration
- **Actions**: `coding_agent_initial.rs`, `coding_agent_follow_up.rs`, `review.rs`, `script.rs`
- **Logs Processing**: Normalizes output from different agents
- **MCP Config**: Manages Model Context Protocol configurations

### `services`
**Purpose**: Business logic and shared services
- Orchestration logic
- Task scheduling
- Agent communication protocols

### `utils`
**Purpose**: Shared utilities
- Diff parsing and change detection
- Common helper functions

### `local-deployment`
**Purpose**: Local development and deployment utilities
- Container management
- PTY (pseudo-terminal) handling
- File copy operations

### `remote`
**Purpose**: Remote deployment server (cloud/team features)
- OAuth authentication
- JWT token handling
- Organization and team management
- Issue tracking integration
- PostgreSQL database operations

### `deployment`
**Purpose**: Deployment configuration and utilities

### `review`
**Purpose**: Code review functionality
- Diff analysis
- Review comments and feedback

---

## Frontend (`frontend/src/`)

### Entry Points
| File | Description |
|------|-------------|
| `main.tsx` | Application bootstrap, PostHog analytics, Sentry error tracking |
| `App.tsx` | Root component, routing, providers setup |

### Pages (`pages/`)
| File | Description |
|------|-------------|
| `Projects.tsx` | Project list and management view |
| `ProjectTasks.tsx` | Kanban board for task management |
| `FullAttemptLogs.tsx` | Full-page execution logs viewer |
| `settings/GeneralSettings.tsx` | General app settings |
| `settings/AgentSettings.tsx` | Coding agent configuration |
| `settings/McpSettings.tsx` | MCP server configuration |
| `settings/ProjectSettings.tsx` | Project-specific settings |
| `settings/ReposSettings.tsx` | Repository management |
| `settings/OrganizationSettings.tsx` | Organization settings |
| `ui-new/Workspaces.tsx` | New design workspace view |
| `ui-new/WorkspacesLanding.tsx` | Workspace landing page |

### Contexts (`contexts/`)
State management using React Context API:

| Context | Purpose |
|---------|---------|
| `ProjectContext.tsx` | Current project state and operations |
| `WorkspaceContext.tsx` | Workspace state management |
| `ExecutionProcessesContext.tsx` | Running agent processes |
| `TerminalContext.tsx` | Terminal/console state |
| `SearchContext.tsx` | Global search functionality |
| `ActionsContext.tsx` | Available actions and commands |
| `ReviewProvider.tsx` | Code review state |
| `GitOperationsContext.tsx` | Git operations state |
| `ApprovalFormContext.tsx` | Agent approval workflows |
| `EntriesContext.tsx` | Log entries management |
| `LogsPanelContext.tsx` | Logs panel UI state |

### Components (`components/`)
- **Layout**: `NormalLayout`, `NewDesignLayout`, `SettingsLayout`
- **Dialogs**: Onboarding, disclaimer, release notes, confirmations
- **UI Components**: Buttons, inputs, cards, modals
- **Legacy Design**: Components for the original UI
- **New Design (`ui-new/`)**: Redesigned component library

### Hooks (`hooks/`)
85+ custom hooks for:
- API calls and data fetching
- WebSocket connections
- Keyboard shortcuts
- Local storage
- Authentication
- Project/task operations

### Stores (`stores/`)
Additional state management (likely Zustand or similar)

### Keyboard (`keyboard/`)
Keyboard shortcut definitions and handlers

---

## Key Data Flows

### 1. Task Execution Flow
```
User creates task → Backend stores in DB →
Agent executor spawned → Agent runs in worktree →
Logs streamed via WebSocket → UI updates in real-time →
Changes detected → Review available
```

### 2. Agent Communication Flow
```
Frontend sends task → Server routes to executor →
Executor spawns agent process →
Agent output captured (stdout/stderr) →
Logs normalized → Stored in DB →
WebSocket broadcasts to frontend
```

### 3. Project/Repository Flow
```
User adds project → Git repo cloned/linked →
Worktrees created for parallel tasks →
Changes tracked per worktree →
Merge/commit operations available
```

---

## Key Components Interaction

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────────────┐ │
│  │ Projects│  │  Tasks   │  │    Execution Logs       │ │
│  │  Page   │──│  Kanban  │──│    (Real-time)          │ │
│  └─────────┘  └──────────┘  └─────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/WebSocket
┌────────────────────────┴────────────────────────────────┐
│                    Server (Rust)                         │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────────────┐ │
│  │   API   │  │ Executor │  │    WebSocket Hub        │ │
│  │ Routes  │──│ Manager  │──│    (Broadcasts)         │ │
│  └─────────┘  └──────────┘  └─────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                    Executors                             │
│  ┌────────┐ ┌────────┐ ┌───────┐ ┌─────┐ ┌───────────┐  │
│  │ Claude │ │ Gemini │ │ Codex │ │ Amp │ │  Others   │  │
│  └────────┘ └────────┘ └───────┘ └─────┘ └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Database Models

### Core Entities
| Model | Description |
|-------|-------------|
| `Project` | A development project with associated repos |
| `Task` | A unit of work assigned to an agent |
| `Workspace` | Isolated environment for task execution |
| `Repo` | Git repository reference |
| `ExecutionProcess` | Running agent instance |
| `Session` | User session tracking |
| `CodingAgentTurn` | Individual agent interaction |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `Cargo.toml` | Rust workspace configuration |
| `package.json` | Node.js dependencies and scripts |
| `vite.config.ts` | Vite bundler configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |
| `default_mcp.json` | Default MCP server configs |
| `default_profiles.json` | Default agent profiles |

---

## Development Commands

```bash
# Install dependencies
pnpm i

# Run development server (frontend + backend)
pnpm run dev

# Run QA testing mode
pnpm run dev:qa

# Build frontend
cd frontend && pnpm build

# Run Rust tests
cargo test --workspace

# Generate TypeScript types from Rust
pnpm run generate-types

# Local NPX build
pnpm run build:npx
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `HOST` | Server host |
| `FRONTEND_PORT` | Frontend dev server port |
| `BACKEND_PORT` | Backend server port |
| `VK_ALLOWED_ORIGINS` | CORS allowed origins |
| `POSTHOG_API_KEY` | Analytics API key |

---

## Type Sharing (Rust ↔ TypeScript)

Types are defined in Rust with `#[derive(TS)]` and auto-generated to `shared/types.ts`:

```rust
// In Rust
#[derive(TS, Serialize, Deserialize)]
struct Task {
    id: Uuid,
    title: String,
    status: TaskStatus,
}
```

```typescript
// Generated in shared/types.ts
export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
}
```

Run `pnpm run generate-types` to regenerate after Rust type changes.
