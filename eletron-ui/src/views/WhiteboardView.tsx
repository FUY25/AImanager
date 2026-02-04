import { useState, useRef } from 'react';
import { mockTasks, mockAgents } from '../data/mockData';
import { Task } from '../types';
import {
  ArrowsOutCardinal,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  FloppyDisk,
  Trash,
} from '@phosphor-icons/react';
import Avatar from '../components/Avatar';

interface CanvasTask {
  task: Task;
  x: number;
  y: number;
}

export default function WhiteboardView() {
  const [canvasTasks, setCanvasTasks] = useState<CanvasTask[]>([
    { task: mockTasks[0], x: 100, y: 100 },
    { task: mockTasks[1], x: 400, y: 100 },
    { task: mockTasks[2], x: 100, y: 300 },
    { task: mockTasks[3], x: 400, y: 300 },
  ]);
  const [zoom, setZoom] = useState(1);
  const [pan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const availableTasks = mockTasks.filter(
    task => !canvasTasks.find(ct => ct.task.id === task.id)
  );

  const getAgentById = (agentId: string | null) => {
    if (!agentId) return undefined;
    return mockAgents.find(agent => agent.id === agentId);
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = mockTasks.find(t => t.id === taskId);

    if (task && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      setCanvasTasks(prev => {
        if (prev.some(ct => ct.task.id === task.id)) return prev;
        return [...prev, { task, x, y }];
      });
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeTaskFromCanvas = (taskId: string) => {
    setCanvasTasks(prev => prev.filter(ct => ct.task.id !== taskId));
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-bg-tertiary border-r border-border p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">Available Tasks</h3>
          <div className="space-y-2">
            {availableTasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                className="bg-bg-elevated border border-border rounded p-3 cursor-move hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-text-low">
                    #{task.id.split('-')[1]}
                  </span>
                </div>
                <div className="text-xs font-medium text-text-high line-clamp-2">
                  {task.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">Agents</h3>
          <div className="space-y-2">
            {mockAgents.map(agent => (
              <div
                key={agent.id}
                className="bg-bg-elevated border border-border rounded p-3"
              >
                <div className="flex items-center gap-2">
                <Avatar
                  src={agent.avatar}
                  alt={agent.name}
                  fallback={agent.name[0]}
                  className="w-7 h-7 rounded-md"
                  textClassName="text-[12px]"
                />
                  <span className="text-xs text-text-normal">{agent.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-bg-tertiary border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-bg-elevated rounded transition-colors">
              <ArrowsOutCardinal size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-bg-elevated rounded transition-colors"
            >
              <MagnifyingGlassMinus size={18} />
            </button>
            <span className="text-sm text-text-normal px-2">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-bg-elevated rounded transition-colors"
            >
              <MagnifyingGlassPlus size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs bg-brand hover:bg-brand/90 text-white rounded transition-colors">
              <FloppyDisk size={16} />
              <span>Save Workflow</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs bg-error hover:bg-error/90 text-white rounded transition-colors">
              <Trash size={16} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="flex-1 bg-bg-elevated overflow-hidden relative"
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          style={{
            backgroundImage: 'radial-gradient(circle, #e3e3de 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
            className="relative w-full h-full"
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {canvasTasks.map(ct => {
                return ct.task.blocks.map(blockId => {
                  const blockedTask = canvasTasks.find(t => t.task.id === blockId);
                  if (!blockedTask) return null;

                  return (
                    <line
                      key={`${ct.task.id}-${blockId}`}
                      x1={ct.x + 100}
                      y1={ct.y + 60}
                      x2={blockedTask.x}
                      y2={blockedTask.y + 60}
                      stroke="#6b6f76"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                });
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#6b6f76" />
                </marker>
              </defs>
            </svg>

            {/* Task Cards */}
            {canvasTasks.map(({ task, x, y }) => {
              const agent = getAgentById(task.assignedTo);
              return (
                <div
                  key={task.id}
                  className="absolute bg-bg-elevated border border-border rounded-lg p-4 shadow-soft cursor-move hover:shadow-medium transition-shadow"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: '200px',
                  }}
                >
                  <button
                    onClick={() => removeTaskFromCanvas(task.id)}
                    className="absolute top-2 right-2 text-text-tertiary hover:text-error"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-text-low">
                      #{task.id.split('-')[1]}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-high mb-2 line-clamp-2">
                    {task.title}
                  </h4>
                  {agent && (
                    <div className="flex items-center gap-2 mt-3">
                      <Avatar
                        src={agent.avatar}
                        alt={agent.name}
                        fallback={agent.name[0]}
                        className="w-6 h-6 rounded-md"
                        textClassName="text-[12px]"
                      />
                      <span className="text-xs text-text-normal">{agent.name}</span>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-text-tertiary">
                    Status: <span className="capitalize">{task.status.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {canvasTasks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-text-low">
                <p className="text-lg mb-2">Drag tasks from the sidebar to start</p>
                <p className="text-sm">Create visual workflows by connecting tasks</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
