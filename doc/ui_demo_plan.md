# AI Agent Management Platform - UI Structure & Demo Implementation Plan

## UI Structure Illustration

### Main View: KANBAN BOARD (Like Vibe Kanban)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  AI AGENT MANAGER                                    [👤] [⚙️] [🌙]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 PROJECT: E-commerce Platform Rebuild                        │   │
│  │  ────────────────────────────────────────────────────────────   │   │
│  │  Status: 🟢 Active  │  12 Tasks  │  4 Agents  │  2 Blocked     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────┐     │
│  │  VIEW SWITCHER                                                 │     │
│  │  [📋 Kanban] [📊 Table] [🎨 Whiteboard] [📈 Timeline] [📡 API]│     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┤
│  │                                                                       │
│  │  CURRENT VIEW: 📋 KANBAN (Vibe Kanban Style)                        │
│  │                                                                       │
│  │  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │  │ 📝 TODO      │ 🏃 IN PROGRESS│ ✅ DONE      │ 🔴 BLOCKED   │     │
│  │  │ (5 tasks)    │ (3 tasks)    │ (4 tasks)    │ (2 tasks)    │     │
│  │  ├──────────────┼──────────────┼──────────────┼──────────────┤     │
│  │  │              │              │              │              │     │
│  │  │ ┌──────────┐│ ┌──────────┐│ ┌──────────┐│ ┌──────────┐│     │
│  │  │ │ #42      ││ │ #38      ││ │ #35      ││ │ #51      ││     │
│  │  │ │ Design   ││ │ API      ││ │ Login    ││ │ Database ││     │
│  │  │ │ Auth UI  ││ │ Endpoint ││ │ Flow     ││ │ Schema   ││     │
│  │  │ │          ││ │          ││ │          ││ │          ││     │
│  │  │ │ 🤖 Claude││ │ 🤖 Gemini││ │ 🤖 Claude││ │ 🤖 Codex ││     │
│  │  │ │ 🔗→#43   ││ │ 🔗→#42   ││ │ ✓ Done   ││ │ ⚠️ Deps  ││     │
│  │  │ └──────────┘│ └──────────┘│ └──────────┘│ └──────────┘│     │
│  │  │              │              │              │              │     │
│  │  │ ┌──────────┐│ ┌──────────┐│ ┌──────────┐│ ┌──────────┐│     │
│  │  │ │ #43      ││ │ #44      ││ │ #36      ││ │ #52      ││     │
│  │  │ │ Implement││ │ Write    ││ │ OAuth    ││ │ API      ││     │
│  │  │ │ Login    ││ │ Tests    ││ │ Buttons  ││ │ Routes   ││     │
│  │  │ │          ││ │          ││ │          ││ │          ││     │
│  │  │ │ 🤖 Unass.││ │ 🤖 Gemini││ │ 🤖 Claude││ │ 🤖 Unass.││     │
│  │  │ │ ⏸️ Wait  ││ │ 🏃 50%   ││ │ ✓ Done   ││ │ ⚠️ Deps  ││     │
│  │  │ └──────────┘│ └──────────┘│ └──────────┘│ └──────────┘│     │
│  │  │              │              │              │              │     │
│  │  │ [+ Add Task]│              │              │              │     │
│  │  │              │              │              │              │     │
│  │  └──────────────┴──────────────┴──────────────┴──────────────┘     │
│  │                                                                       │
│  │  [Drag cards between columns to change status]                      │
│  │                                                                       │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  TASK DETAIL PANEL (Click any task to expand)                   │   │
│  │  ────────────────────────────────────────────────────────────   │   │
│  │  #42 - Design Auth UI                                           │   │
│  │  Assigned: 🤖 Claude Opus 4.5  │  Status: 📝 TODO              │   │
│  │  Dependencies: None  │  Blocks: #43, #44                        │   │
│  │                                                                   │   │
│  │  [Context Handoff Preview]                                       │   │
│  │  "Design a modern authentication UI with email/password login,  │   │
│  │   social OAuth buttons, and password reset flow..."             │   │
│  │                                                                   │   │
│  │  [💬 Chat] [📄 Files] [🔗 Dependencies] [📊 Progress]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────┘
```

## Design System & Styling

**Notion-style Clean UI** with Vibe Kanban's design system:

### Colors
- **Text**: `text-high` (primary), `text-normal` (standard), `text-low` (muted)
- **Background**: `bg-primary` (main), `bg-secondary` (cards/inputs), `bg-panel` (elevated)
- **Accent**: `brand` (orange), `error`, `success`

### Typography
- **Font**: IBM Plex Sans (default), IBM Plex Mono (code)
- **Sizes**: `text-xs` (8px), `text-sm` (10px), `text-base` (12px), `text-lg` (14px)

### Spacing
- `p-half` (6px), `p-base` (12px), `p-double` (24px)

### Components
- Small border radius (`rounded`)
- Focus rings use `ring-brand` (orange)
- Clean, minimal aesthetic

## Alternative Views

### 1. 📊 TABLE VIEW (Agent-Grouped Task List)

**Key Concept**: Each row is a task/todo. Each toggleable section is an agent.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TABLE VIEW - Tasks Grouped by Agent                                    │
│  ────────────────────────────────────────────────────────────────────   │
│  FILTER: [Status ▼] [Priority ▼]  │  SORT: [Created ▼]  │  [+ Add Task]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ▼ 🤖 Claude Opus 4.5 (3 tasks)                    [Collapse] [Assign] │
│  ┌────┬──────────────┬──────────┬──────────┬──────────┬──────────────┐ │
│  │ ☐  │ Task         │ Status   │ Priority │ Deps     │ Progress     │ │
│  ├────┼──────────────┼──────────┼──────────┼──────────┼──────────────┤ │
│  │ ☐  │ #42 Design   │ 📝 TODO  │ High     │ None     │ ░░░░░░░░  0% │ │
│  │    │ Auth UI      │          │          │          │              │ │
│  ├────┼──────────────┼──────────┼──────────┼──────────┼──────────────┤ │
│  │ ☐  │ #43 Implement│ ⏸️ Wait  │ High     │ #42      │ ░░░░░░░░  0% │ │
│  │    │ Login        │          │          │          │              │ │
│  ├────┼──────────────┼──────────┼──────────┼──────────┼──────────────┤ │
│  │ ☑  │ #35 Login    │ ✅ DONE  │ High     │ None     │ ████████100% │ │
│  │    │ Flow         │          │          │          │              │ │
│  └────┴──────────────┴──────────┴──────────┴──────────┴──────────────┘ │
│                                                                           │
│  ▼ 🤖 Gemini Pro 2.0 (2 tasks)                     [Collapse] [Assign] │
│  ┌────┬──────────────┬──────────┬──────────┬──────────┬──────────────┐ │
│  │ ☐  │ #38 API      │ 🏃 Active│ High     │ #42      │ ██████░░ 75% │ │
│  │    │ Endpoint     │          │          │          │              │ │
│  ├────┼──────────────┼──────────┼──────────┼──────────┼──────────────┤ │
│  │ ☐  │ #44 Write    │ 🏃 Active│ Medium   │ None     │ ████░░░░ 50% │ │
│  │    │ Tests        │          │          │          │              │ │
│  └────┴──────────────┴──────────┴──────────┴──────────┴──────────────┘ │
│                                                                           │
│  ▶ 🤖 Codex GPT-4 (1 task)                         [Expand] [Assign]   │
│  (Collapsed - click to expand)                                          │
│                                                                           │
│  ▼ 🤖 Unassigned (2 tasks)                         [Collapse] [Assign] │
│  ┌────┬──────────────┬──────────┬──────────┬──────────┬──────────────┐ │
│  │ ☐  │ #52 API      │ 🔴 Block │ High     │ #38, #42 │ ░░░░░░░░  0% │ │
│  │    │ Routes       │          │          │          │              │ │
│  ├────┼──────────────┼──────────┼──────────┼──────────┼──────────────┤ │
│  │ ☐  │ #53 Deploy   │ 📝 TODO  │ Low      │ All      │ ░░░░░░░░  0% │ │
│  │    │ to Prod      │          │          │          │              │ │
│  └────┴──────────────┴──────────┴──────────┴──────────┴──────────────┘ │
│                                                                           │
│  [Bulk Actions: ☑ Select All | Reassign | Change Status | Delete]      │
└───────────────────────────────────────────────────────────────────────┘
```

**Features**:
- Each agent section is collapsible/expandable (▼/▶)
- Each row is a task (checkbox for selection)
- Click agent header to assign multiple tasks at once
- Drag tasks between agent sections to reassign
- Inline editing: click cells to edit

### 2. 🎨 WHITEBOARD VIEW (Workflow Design Canvas)

**Key Concept**: Visual canvas for designing potential workflows. Drag & drop cards to create workflow sequences.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  WHITEBOARD - Workflow Design Canvas                                    │
│  ────────────────────────────────────────────────────────────────────   │
│  [🎨 Draw] [📦 Add Card] [🔗 Connect] [💾 Save] [🗑️ Clear]            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  INFINITE CANVAS (Pan & Zoom)                                   │   │
│  │                                                                   │   │
│  │     ┌──────────┐                                                 │   │
│  │     │ START    │                                                 │   │
│  │     │ Design   │                                                 │   │
│  │     │ Phase    │                                                 │   │
│  │     └────┬─────┘                                                 │   │
│  │          │                                                        │   │
│  │          ▼                                                        │   │
│  │     ┌──────────┐         ┌──────────┐                           │   │
│  │     │ #42      │────────▶│ #43      │                           │   │
│  │     │ Design   │         │ Implement│                           │   │
│  │     │ Auth UI  │         │ Login    │                           │   │
│  │     │ 🤖 Claude│         │ 🤖 Claude│                           │   │
│  │     └────┬─────┘         └────┬─────┘                           │   │
│  │          │                    │                                  │   │
│  │          │                    │                                  │   │
│  │          ▼                    ▼                                  │   │
│  │     ┌──────────┐         ┌──────────┐                           │   │
│  │     │ #38      │         │ #45      │                           │   │
│  │     │ API      │         │ Review   │                           │   │
│  │     │ Endpoint │         │ PR       │                           │   │
│  │     │ 🤖 Gemini│         │ 🤖 Claude│                           │   │
│  │     └────┬─────┘         └──────────┘                           │   │
│  │          │                                                        │   │
│  │          ▼                                                        │   │
│  │     ┌──────────┐                                                 │   │
│  │     │ #51      │                                                 │   │
│  │     │ Database │                                                 │   │
│  │     │ Schema   │                                                 │   │
│  │     │ 🤖 Codex │                                                 │   │
│  │     └──────────┘                                                 │   │
│  │                                                                   │   │
│  │  [Drag cards from sidebar to add to workflow]                   │   │
│  │  [Click and drag between cards to create connections]           │   │
│  │  [Right-click cards for options]                                │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  SIDEBAR: Available Cards                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📋 All Tasks (12)                                               │   │
│  │  ────────────────                                                │   │
│  │  [#44 Write Tests]                                               │   │
│  │  [#52 API Routes]                                                │   │
│  │  [#53 Deploy]                                                    │   │
│  │  ...                                                              │   │
│  │                                                                   │   │
│  │  🤖 Agents (4)                                                   │   │
│  │  ────────────                                                    │   │
│  │  [Claude Opus 4.5]                                               │   │
│  │  [Gemini Pro 2.0]                                                │   │
│  │  [Codex GPT-4]                                                   │   │
│  │  [Cursor Agent]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────┘
```

**Features**:
- Infinite canvas (pan with mouse, zoom with scroll)
- Drag task cards from sidebar onto canvas
- Click and drag between cards to create workflow connections
- Visual arrows show task dependencies and sequence
- Save workflow templates for reuse
- Export as image or JSON


### 4. 📡 API VIEW (Model Usage & Performance)

**Key Concept**: Monitor API usage, costs, and performance for each AI model.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  API USAGE & PERFORMANCE DASHBOARD                                      │
│  ────────────────────────────────────────────────────────────────────   │
│  Period: [Last 7 Days ▼]  │  [Export Report]  │  [Set Alerts]         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  COST OVERVIEW                                                    │  │
│  │  ──────────────                                                   │  │
│  │  Total Spend: $127.45  │  Budget: $500/month  │  Remaining: 74% │  │
│  │                                                                    │  │
│  │  ████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │                                                                    │  │
│  │  Trend: ↗️ +15% vs last week                                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  MODEL BREAKDOWN                                                  │  │
│  │  ────────────────                                                 │  │
│  │                                                                    │  │
│  │  🤖 Claude Opus 4.5                                               │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Requests: 1,247  │  Tokens: 2.4M  │  Cost: $68.20         │  │  │
│  │  │ Avg Latency: 1.2s  │  Success Rate: 99.2%                  │  │  │
│  │  │ ████████████████████████████████████████████████░░░░░░░░  │  │  │
│  │  │ Input: 1.8M tokens  │  Output: 600K tokens                  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  🤖 Gemini Pro 2.0                                                │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Requests: 892    │  Tokens: 1.6M  │  Cost: $42.15         │  │  │
│  │  │ Avg Latency: 0.9s  │  Success Rate: 98.8%                  │  │  │
│  │  │ ████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░  │  │  │
│  │  │ Input: 1.2M tokens  │  Output: 400K tokens                  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  🤖 Codex GPT-4                                                   │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Requests: 324    │  Tokens: 580K  │  Cost: $17.10         │  │  │
│  │  │ Avg Latency: 1.5s  │  Success Rate: 97.5%                  │  │  │
│  │  │ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │  │
│  │  │ Input: 420K tokens  │  Output: 160K tokens                  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  🤖 Cursor Agent                                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Requests: 0      │  Tokens: 0     │  Cost: $0.00          │  │  │
│  │  │ Status: ⚪ Not Used                                         │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  USAGE TIMELINE (Last 7 Days)                                    │  │
│  │  ──────────────────────────                                      │  │
│  │                                                                    │  │
│  │  Requests                                                         │  │
│  │  500 ┤                                                    ●       │  │
│  │  400 ┤                              ●                  ●   ●     │  │
│  │  300 ┤                    ●       ●   ●              ●       ●   │  │
│  │  200 ┤          ●       ●   ●   ●       ●          ●             │  │
│  │  100 ┤    ●   ●   ●   ●       ●           ●      ●               │  │
│  │    0 ┼────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────   │  │
│  │      Mon  Tue  Wed  Thu  Fri  Sat  Sun  Mon  Tue  Wed  Thu      │  │
│  │                                                                    │  │
│  │  ─── Claude  ─── Gemini  ─── Codex                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ERROR LOG (Last 24 Hours)                                       │  │
│  │  ──────────────────────────                                      │  │
│  │  🔴 2 hours ago  │  Claude Opus 4.5  │  Rate limit exceeded     │  │
│  │  🟡 5 hours ago  │  Gemini Pro 2.0   │  Timeout (30s)           │  │
│  │  🔴 8 hours ago  │  Codex GPT-4      │  Invalid API key         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ALERTS & RECOMMENDATIONS                                        │  │
│  │  ──────────────────────────────                                  │  │
│  │  ⚠️ Claude Opus 4.5 approaching rate limit (85% of quota)        │  │
│  │  💡 Consider switching some tasks to Gemini Pro (lower cost)     │  │
│  │  📊 Peak usage: 2-4 PM daily - consider load balancing           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────┘
```

**Features**:
- Real-time cost tracking per model
- Token usage breakdown (input/output)
- Performance metrics (latency, success rate)
- Usage timeline chart
- Error log with timestamps
- Budget alerts and recommendations
- Export reports for billing

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TOP NAVIGATION BAR                                                      │
│  ────────────────────────────────────────────────────────────────────   │
│  [🏠 Home] [📊 Projects] [🤖 Agents] [⚙️ Settings]                      │
│                                                                           │
│  MAIN CONTENT AREA                                                       │
│  ────────────────────────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PROJECT SELECTOR (if multiple projects)                        │   │
│  │  [E-commerce Platform ▼]                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  VIEW TABS                                                       │   │
│  │  [📋 Kanban] [📊 Table] [🎨 Whiteboard] [📡 API]                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  MAIN VIEW CONTENT (changes based on selected tab)              │   │
│  │                                                                   │   │
│  │  [Dynamic content area - see views above]                        │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SIDE PANEL (Collapsible)                                        │   │
│  │  ────────────────────────────────────────────────────────────   │   │
│  │  📋 TASK DETAILS                                                 │   │
│  │  🤖 AGENT STATUS                                                 │   │
│  │  💬 CONTEXT HANDOFF                                              │   │
│  │  📊 ANALYTICS                                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────┘
```

## Key UI Features

### 1. Kanban View (Primary - Like Vibe Kanban)
- **Status Columns**: TODO, IN PROGRESS, DONE, BLOCKED
- **Drag & Drop**: Drag cards between columns to change status
- **Task Cards**: Show task title, assigned agent, dependencies, progress
- **Quick Actions**: Click cards for details, right-click for context menu
- **Visual Dependencies**: Icons showing task relationships (🔗→#43)

### 2. Table View (Agent-Grouped Task List)
- **Agent Sections**: Each toggleable section is an agent
- **Task Rows**: Each row is a task/todo with checkbox
- **Collapsible Groups**: Expand/collapse agent sections (▼/▶)
- **Inline Editing**: Click cells to edit task properties
- **Bulk Operations**: Select multiple tasks for batch actions
- **Drag to Reassign**: Drag tasks between agent sections

### 3. Whiteboard View (Workflow Design)
- **Infinite Canvas**: Pan and zoom for large workflows
- **Drag & Drop Cards**: Drag tasks from sidebar onto canvas
- **Visual Connections**: Click and drag between cards to create workflow arrows
- **Workflow Templates**: Save and reuse workflow patterns
- **Export Options**: Export as image or JSON

### 4. API View (Model Usage & Performance)
- **Cost Tracking**: Real-time spend per model with budget alerts
- **Token Usage**: Input/output token breakdown
- **Performance Metrics**: Latency, success rate, error logs
- **Usage Timeline**: Chart showing API calls over time
- **Recommendations**: AI-powered suggestions for cost optimization

### 5. Task Detail Panel
- **Context Handoff Preview**: See what information will be passed to agents
- **Dependency Management**: Add/remove task dependencies
- **Chat Interface**: Communicate with agents about specific tasks
- **File Attachments**: View files related to the task
- **Progress Tracking**: Visual progress bars and completion estimates

### 6. Agent Avatars & Status
- **System-assigned Avatars**: Fun, unique avatars for each agent type
- **Real-time Status Indicators**:
  - 🟢 Active (working on task)
  - 🟡 Busy (at capacity)
  - 🔴 Blocked (waiting for dependencies)
  - ⚪ Idle (available for work)
- **Capability Badges**: Show agent specializations (UI, API, DB, etc.)

## Implementation Plan

### Phase 1: Setup & Foundation
**Goal**: Create project structure and mock data

**Tasks**:
1. Create new demo project directory structure
2. Set up React + TypeScript + Vite + Tailwind
3. Create mock data for agents, tasks, and projects
4. Set up routing with React Router
5. Create base layout components

**Files to Create**:
- `/demo/` - New demo project root
- `/demo/src/data/mockData.ts` - Mock agents, tasks, projects, API usage
- `/demo/src/types/` - TypeScript interfaces
- `/demo/src/components/layout/` - Layout components
- `/demo/src/App.tsx` - Main app with routing

### Phase 2: Core Views
**Goal**: Build the 5 main views with mock data

**Tasks**:
1. **Kanban View** (Primary - Like Vibe Kanban)
   - Status columns (TODO, IN PROGRESS, DONE, BLOCKED)
   - Task cards with drag & drop
   - Agent assignment on cards

2. **Table View** (Agent-Grouped)
   - Collapsible agent sections
   - Task rows with checkboxes
   - Inline editing
   - Drag to reassign

3. **Whiteboard View** (Workflow Design)
   - Infinite canvas with pan/zoom
   - Drag & drop cards from sidebar
   - Visual connection lines
   - Save/export workflows

4. **Timeline View** (Gantt-style)
   - Task duration bars
   - Dependency arrows
   - Critical path highlighting

5. **API View** (Model Usage)
   - Cost tracking per model
   - Token usage breakdown
   - Performance metrics
   - Usage timeline chart
   - Error log

**Files to Create**:
- `/demo/src/views/KanbanView.tsx`
- `/demo/src/views/TableView.tsx`
- `/demo/src/views/WhiteboardView.tsx`
- `/demo/src/views/TimelineView.tsx`
- `/demo/src/views/ApiView.tsx`
- `/demo/src/components/TaskCard.tsx`
- `/demo/src/components/AgentSection.tsx`

### Phase 3: Interactions & Polish
**Goal**: Add interactivity and polish

**Tasks**:
1. Implement drag & drop for Kanban and Table views
2. Add task detail panel
3. Implement view switching
4. Add whiteboard canvas interactions
5. Add animations and transitions
6. Polish styling and responsiveness

**Files to Create**:
- `/demo/src/components/TaskDetailPanel.tsx`
- `/demo/src/hooks/useDragAndDrop.ts`
- `/demo/src/hooks/useTaskSelection.ts`
- `/demo/src/hooks/useCanvas.ts`

## Technology Stack for Demo

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State**: React Context + useState (simple for demo)
- **Mock Data**: Static JSON objects

## Mock Data Structure

```typescript
interface Agent {
  id: string;
  name: string;
  type: 'claude' | 'gemini' | 'codex' | 'cursor';
  avatar: string; // emoji or image URL
  status: 'active' | 'busy' | 'blocked' | 'idle';
  capabilities: string[];
  currentTasks: string[]; // task IDs
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string | null; // agent ID or null for unassigned
  dependencies: string[]; // task IDs
  blocks: string[]; // task IDs
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  tasks: Task[];
  agents: Agent[];
}

interface ApiUsage {
  modelId: string;
  modelName: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  avgLatency: number; // in seconds
  successRate: number; // 0-100
  errors: ApiError[];
}

interface ApiError {
  timestamp: Date;
  modelId: string;
  errorType: string;
  message: string;
}
```

## Critical Files to Modify

### New Files (Demo Project)
1. `/demo/package.json` - Dependencies
2. `/demo/vite.config.ts` - Vite configuration
3. `/demo/tailwind.config.js` - Tailwind configuration
4. `/demo/src/data/mockData.ts` - Mock data
5. `/demo/src/App.tsx` - Main application
6. `/demo/src/views/*.tsx` - View components
7. `/demo/src/components/*.tsx` - Reusable components

### Existing Files (Reference Only)
- `/Users/fuyuming/Desktop/AImanager/AI management/learning material/vibe-kanban/frontend/` - Reference for component patterns
- `/Users/fuyuming/Desktop/AImanager/doc/agent_management_platform_vision.md` - Product vision

## Verification Steps

After implementation:

1. **Visual Verification**:
   - Open demo in browser at `http://localhost:5173`
   - Verify all 5 views render correctly (Kanban, Table, Whiteboard, Timeline, API)
   - Test view switching between tabs
   - Verify responsive layout on different screen sizes

2. **Interaction Verification**:
   - **Kanban**: Drag cards between status columns
   - **Table**: Expand/collapse agent sections, drag tasks between agents
   - **Whiteboard**: Drag cards onto canvas, create connections
   - **Timeline**: View dependency arrows and critical path
   - **API**: View cost breakdown and usage charts
   - Click task cards to open detail panel

3. **Data Verification**:
   - Verify mock data loads correctly
   - Check task dependencies display properly
   - Verify agent status indicators update
   - Test task assignment changes
   - Verify API usage metrics display

4. **Performance Verification**:
   - Check smooth animations and transitions
   - Verify drag & drop responsiveness
   - Test whiteboard canvas pan/zoom
   - Test with 20+ tasks to ensure performance

## Success Criteria

✅ All 5 views (Kanban, Table, Whiteboard, Timeline, API) render with mock data
✅ Drag & drop works in Kanban and Table views
✅ Whiteboard canvas supports drag & drop and connections
✅ Task detail panel opens on click
✅ View switching works smoothly
✅ Responsive design works on desktop and tablet
✅ Agent avatars and status indicators display correctly
✅ Dependencies visualized in Timeline view
✅ API usage metrics display with charts
✅ Clean, modern UI matching the vision document

## Next Steps After Approval

1. Create demo project structure in `/demo/` directory
2. Set up build tooling (Vite + Tailwind + React Router)
3. Create comprehensive mock data (tasks, agents, API usage)
4. Build layout and navigation components
5. Implement Kanban view (primary view, like Vibe Kanban)
6. Implement Table view (agent-grouped task list)
7. Implement Whiteboard view (workflow design canvas)
8. Implement Timeline view (Gantt-style dependencies)
9. Implement API view (model usage & performance)
10. Add task detail panel
11. Add interactivity (drag & drop, canvas interactions)
12. Polish styling, animations, and responsiveness
13. Test all views and interactions
14. Deploy demo for review
