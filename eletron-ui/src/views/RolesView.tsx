import { useState } from 'react';
import {
  Plus,
  FileText,
  Pencil,
  Copy,
  Check,
  X,
  CloudArrowUp,
  Trash,
  CaretDown,
  CaretRight,
} from '@phosphor-icons/react';
import Avatar from '../components/Avatar';

interface ManagedItem {
  id: string;
  name: string;
  description: string;
}

interface VerificationFile {
  id: string;
  fileName: string;
  learnings: string;
}

interface RoleProfile {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  checkpointPreference: string;
  tags: string[];
  suggestedSkills: string[];
  suggestedMcps: string[];
  verificationFiles: VerificationFile[];
  feedback: {
    id: string;
    session: string;
    task: string;
    rating: number;
    note: string;
  }[];
}

const seedProfiles: RoleProfile[] = [
  {
    id: 'role-1',
    name: 'Frontend Specialist',
    description: 'Owns UI polish, accessibility, and component refactors.',
    avatar: '/avatars/agent-1.png',
    checkpointPreference: 'Ask before final UI polish and after first pass.',
    tags: ['React', 'UX', 'A11y'],
    suggestedSkills: ['UI Review', 'Design QA'],
    suggestedMcps: ['Docs MCP', 'File System MCP'],
    verificationFiles: [
      {
        id: 'vf-1',
        fileName: 'ideal-ui-review.md',
        learnings: 'Use this to match spacing, typography rhythm, and UI tone.',
      },
    ],
    feedback: [
      {
        id: 'fb-1',
        session: 'Session 14',
        task: 'Checkout redesign',
        rating: 4.5,
        note: 'Strong UI polish, but missed edge-case states.',
      },
      {
        id: 'fb-2',
        session: 'Session 12',
        task: 'Design QA pass',
        rating: 4.0,
        note: 'Great visual cleanup, needs tighter spacing consistency.',
      },
    ],
  },
  {
    id: 'role-2',
    name: 'API Reliability',
    description: 'Improves stability, testing, and observability for services.',
    avatar: '/avatars/agent-2.png',
    checkpointPreference: 'Check in before proposing fixes and after tests run.',
    tags: ['Node', 'Testing', 'SRE'],
    suggestedSkills: ['Root Cause Analysis', 'Regression Testing'],
    suggestedMcps: ['Database MCP', 'Logs MCP'],
    verificationFiles: [
      {
        id: 'vf-2',
        fileName: 'reliability-playbook.pdf',
        learnings: 'Follow this structure when summarizing incident analysis.',
      },
    ],
    feedback: [
      {
        id: 'fb-3',
        session: 'Session 9',
        task: 'Login API regression',
        rating: 3.5,
        note: 'Found the issue quickly, but coverage plan was thin.',
      },
    ],
  },
  {
    id: 'role-3',
    name: 'Product Analyst',
    description: 'Tracks outcomes, experiments, and KPI dashboards.',
    avatar: '/avatars/agent-3.png',
    checkpointPreference: 'Ask user to validate assumptions before final insights.',
    tags: ['SQL', 'Metrics', 'Research'],
    suggestedSkills: ['Insight Synthesis', 'Experiment Design'],
    suggestedMcps: ['Analytics MCP', 'Docs MCP'],
    verificationFiles: [],
    feedback: [],
  },
];

export default function RolesView() {
  const [profiles, setProfiles] = useState<RoleProfile[]>(seedProfiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'profiles' | 'management'>('profiles');
  const [skills, setSkills] = useState<ManagedItem[]>([
    {
      id: 'skill-1',
      name: 'UI Review',
      description: 'Audit layout, spacing, and visual hierarchy for polish.',
    },
    {
      id: 'skill-2',
      name: 'Root Cause Analysis',
      description: 'Trace failures, isolate root causes, and propose fixes.',
    },
    {
      id: 'skill-3',
      name: 'Experiment Design',
      description: 'Define hypotheses, metrics, and evaluation plan.',
    },
  ]);
  const [mcps, setMcps] = useState<ManagedItem[]>([
    {
      id: 'mcp-1',
      name: 'Docs MCP',
      description: 'Access product specs, research docs, and reference notes.',
    },
    {
      id: 'mcp-2',
      name: 'File System MCP',
      description: 'Browse project files, diagrams, and assets.',
    },
    {
      id: 'mcp-3',
      name: 'Logs MCP',
      description: 'View runtime logs, traces, and error reports.',
    },
  ]);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [newMcp, setNewMcp] = useState({ name: '', description: '' });
  const [draft, setDraft] = useState({
    name: '',
    description: '',
    checkpointPreference: '',
    tags: '',
    verificationFiles: [] as VerificationFile[],
    suggestedSkills: '',
    suggestedMcps: '',
  });

  const isEditing = Boolean(editingId);

  const resetDraft = () => {
    setDraft({
      name: '',
      description: '',
      checkpointPreference: '',
      tags: '',
      verificationFiles: [],
      suggestedSkills: '',
      suggestedMcps: '',
    });
    setEditingId(null);
    setDrawerOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;

    const nextTags = draft.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
    const nextSuggestedSkills = draft.suggestedSkills
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    const nextSuggestedMcps = draft.suggestedMcps
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    if (editingId) {
      setProfiles(prev =>
        prev.map(profile =>
          profile.id === editingId
            ? {
                ...profile,
                name: draft.name.trim(),
                description: draft.description.trim(),
                checkpointPreference: draft.checkpointPreference.trim(),
                tags: nextTags,
                suggestedSkills: nextSuggestedSkills,
                suggestedMcps: nextSuggestedMcps,
                feedback: profile.feedback,
                verificationFiles: draft.verificationFiles,
              }
            : profile
        )
      );
      resetDraft();
      return;
    }

    setProfiles(prev => [
      {
        id: `role-${Date.now()}`,
        name: draft.name.trim(),
        description: draft.description.trim(),
        checkpointPreference: draft.checkpointPreference.trim(),
        tags: nextTags,
        suggestedSkills: nextSuggestedSkills,
        suggestedMcps: nextSuggestedMcps,
        verificationFiles: draft.verificationFiles,
        feedback: [],
      },
      ...prev,
    ]);
    resetDraft();
  };

  const startEdit = (profile: RoleProfile) => {
    setEditingId(profile.id);
    setDraft({
      name: profile.name,
      description: profile.description,
      checkpointPreference: profile.checkpointPreference,
      tags: profile.tags.join(', '),
      verificationFiles: profile.verificationFiles,
      suggestedSkills: profile.suggestedSkills.join(', '),
      suggestedMcps: profile.suggestedMcps.join(', '),
    });
    setDrawerOpen(true);
  };

  const duplicateProfile = (profile: RoleProfile) => {
    setProfiles(prev => [
      {
        ...profile,
        id: `role-${Date.now()}`,
        name: `${profile.name} Copy`,
        verificationFiles: profile.verificationFiles.map(file => ({
          ...file,
          id: `vf-${Date.now()}-${file.id}`,
        })),
        suggestedSkills: [...profile.suggestedSkills],
        suggestedMcps: [...profile.suggestedMcps],
      },
      ...prev,
    ]);
  };

  const totalProfiles = profiles.length;

  const openNewRole = () => {
    setEditingId(null);
    setDraft({
      name: '',
      description: '',
      checkpointPreference: '',
      tags: '',
      verificationFiles: [],
      suggestedSkills: '',
      suggestedMcps: '',
    });
    setDrawerOpen(true);
  };

  const handleUploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setDraft(prev => ({
      ...prev,
      verificationFiles: [
        ...prev.verificationFiles,
        ...files.map(file => ({
          id: `vf-${Date.now()}-${file.name}`,
          fileName: file.name,
          learnings: '',
        })),
      ],
    }));
    event.target.value = '';
  };

  const updateVerificationFile = (fileId: string, value: string) => {
    setDraft(prev => ({
      ...prev,
      verificationFiles: prev.verificationFiles.map(file =>
        file.id === fileId ? { ...file, learnings: value } : file
      ),
    }));
  };

  const removeVerificationFile = (fileId: string) => {
    setDraft(prev => ({
      ...prev,
      verificationFiles: prev.verificationFiles.filter(file => file.id !== fileId),
    }));
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills(prev => [
      {
        id: `skill-${Date.now()}`,
        name: newSkill.name.trim(),
        description: newSkill.description.trim(),
      },
      ...prev,
    ]);
    setNewSkill({ name: '', description: '' });
  };

  const addMcp = () => {
    if (!newMcp.name.trim()) return;
    setMcps(prev => [
      {
        id: `mcp-${Date.now()}`,
        name: newMcp.name.trim(),
        description: newMcp.description.trim(),
      },
      ...prev,
    ]);
    setNewMcp({ name: '', description: '' });
  };

  const toggleFeedback = (profileId: string) => {
    setExpandedFeedback(prev => {
      const next = new Set(prev);
      if (next.has(profileId)) {
        next.delete(profileId);
      } else {
        next.add(profileId);
      }
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Apprentices</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-text-tertiary">{totalProfiles} profiles</div>
          <button
            onClick={() => setViewMode(viewMode === 'profiles' ? 'management' : 'profiles')}
            className="text-[11px] px-2.5 py-1.5 bg-bg-tertiary border border-border rounded-md text-text-secondary hover:text-text-primary"
          >
            {viewMode === 'profiles' ? 'Skill & MCP management' : 'Back to apprentices'}
          </button>
          <button
            onClick={openNewRole}
            className="flex items-center gap-2 text-[11px] px-2.5 py-1.5 bg-brand hover:bg-brand/90 text-white rounded-md"
          >
            <Plus size={12} />
            New apprentice profile
          </button>
        </div>
      </div>

      {viewMode === 'profiles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {profiles.map(profile => {
            const feedbackOpen = expandedFeedback.has(profile.id);
            const preferredSkills = profile.suggestedSkills.slice(0, 3);
            return (
              <div
                key={profile.id}
                className="border border-border rounded-lg p-4 bg-bg-elevated flex flex-col hover:shadow-soft transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={profile.avatar}
                      alt={profile.name}
                      fallback={profile.name[0]}
                      className="w-12 h-12 rounded-full shadow-[0_10px_18px_rgba(40,35,28,0.16)]"
                      textClassName="text-base"
                      ring
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-text-primary">{profile.name}</div>
                        <FileText size={14} className="text-text-tertiary" />
                      </div>
                      <div className="text-sm text-text-secondary mt-2">
                        Goal: {profile.description}
                      </div>
                      {preferredSkills.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-text-tertiary">
                          <span className="uppercase tracking-wide text-text-tertiary">
                            Preferred
                          </span>
                          {preferredSkills.map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-full border border-border bg-bg-tertiary text-text-secondary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(profile)}
                      onMouseDown={(event) => event.stopPropagation()}
                      onClickCapture={(event) => event.stopPropagation()}
                      className="p-2 rounded-md border border-border bg-bg-tertiary text-text-secondary hover:text-text-primary"
                      aria-label="Edit apprentice"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => duplicateProfile(profile)}
                      onMouseDown={(event) => event.stopPropagation()}
                      onClickCapture={(event) => event.stopPropagation()}
                      className="p-2 rounded-md border border-border bg-bg-tertiary text-text-secondary hover:text-text-primary"
                      aria-label="Duplicate apprentice"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-text-tertiary">
                  Checkpoints: {profile.checkpointPreference || 'No preference set'}
                </div>
                {profile.verificationFiles.length > 0 && (
                  <div className="mt-2 text-sm text-text-tertiary">
                    Verification: {profile.verificationFiles.length} file
                    {profile.verificationFiles.length > 1 ? 's' : ''}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleFeedback(profile.id)}
                  className="mt-3 flex items-center justify-between text-[11px] text-text-tertiary hover:text-text-primary"
                >
                  <span className="flex items-center gap-1.5">
                    {feedbackOpen ? <CaretDown size={12} /> : <CaretRight size={12} />}
                    Feedback ({profile.feedback.length})
                  </span>
                  <span className="text-text-tertiary">View</span>
                </button>
                {feedbackOpen && (
                  <div className="mt-2 space-y-2">
                    {profile.feedback.length === 0 ? (
                      <div className="text-xs text-text-tertiary bg-bg-tertiary border border-border rounded-md px-3 py-2">
                        No feedback yet.
                      </div>
                    ) : (
                      profile.feedback.map(entry => (
                        <div
                          key={entry.id}
                          className="border border-border rounded-md bg-bg-tertiary px-3 py-2"
                        >
                          <div className="flex items-center justify-between text-xs text-text-tertiary">
                            <span>{entry.session}</span>
                            <span>{entry.rating.toFixed(1)} / 5</span>
                          </div>
                          <div className="text-sm font-semibold text-text-primary mt-1">
                            {entry.task}
                          </div>
                          <div className="text-xs text-text-secondary mt-1">
                            {entry.note}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {profiles.length === 0 && (
            <div className="border border-dashed border-border rounded-lg p-6 text-xs text-text-tertiary flex items-center gap-2">
              <X size={14} />
              No apprentice profiles yet. Add one to get started.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-bg-elevated border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                Skill management
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-bg-tertiary border border-border rounded-md p-3 space-y-2">
                <div className="text-xs text-text-tertiary uppercase tracking-wide">Add skill</div>
                <input
                  value={newSkill.name}
                  onChange={(event) => setNewSkill(prev => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="Skill name"
                />
                <textarea
                  value={newSkill.description}
                  onChange={(event) => setNewSkill(prev => ({ ...prev, description: event.target.value }))}
                  className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-xs text-text-primary h-20 resize-none"
                  placeholder="Describe when this skill should be used."
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="w-full px-3 py-2 text-xs bg-brand hover:bg-brand/90 text-white rounded-md"
                >
                  Add skill
                </button>
              </div>

              <div className="space-y-2">
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    className="border border-border rounded-md p-3 bg-bg-tertiary"
                  >
                    <div className="text-sm font-semibold text-text-primary">{skill.name}</div>
                    <div className="text-xs text-text-tertiary mt-1">{skill.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                MCP management
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-bg-tertiary border border-border rounded-md p-3 space-y-2">
                <div className="text-xs text-text-tertiary uppercase tracking-wide">Add MCP</div>
                <input
                  value={newMcp.name}
                  onChange={(event) => setNewMcp(prev => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="MCP name"
                />
                <textarea
                  value={newMcp.description}
                  onChange={(event) => setNewMcp(prev => ({ ...prev, description: event.target.value }))}
                  className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-xs text-text-primary h-20 resize-none"
                  placeholder="Describe what this MCP provides."
                />
                <button
                  type="button"
                  onClick={addMcp}
                  className="w-full px-3 py-2 text-xs bg-brand hover:bg-brand/90 text-white rounded-md"
                >
                  Add MCP
                </button>
              </div>

              <div className="space-y-2">
                {mcps.map(mcp => (
                  <div
                    key={mcp.id}
                    className="border border-border rounded-md p-3 bg-bg-tertiary"
                  >
                    <div className="text-sm font-semibold text-text-primary">{mcp.name}</div>
                    <div className="text-xs text-text-tertiary mt-1">{mcp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/20"
            onClick={resetDraft}
            aria-hidden="true"
          />
          <div className="w-full max-w-xl bg-bg-elevated border-l border-border h-full overflow-auto">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {isEditing ? 'Edit Apprentice Profile' : 'New Apprentice Profile'}
                </h3>
                <div className="text-xs text-text-tertiary mt-1">
                  Define how the agent should operate and learn.
                </div>
              </div>
              <button
                type="button"
                onClick={resetDraft}
                className="p-2 rounded-md border border-border bg-bg-tertiary text-text-secondary hover:text-text-primary"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="space-y-1">
              <label className="text-xs text-text-tertiary uppercase tracking-wide">Apprentice name</label>
              <input
                value={draft.name}
                onChange={(event) => setDraft(prev => ({ ...prev, name: event.target.value }))}
                className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="e.g. QA Automation"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-tertiary uppercase tracking-wide">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft(prev => ({ ...prev, description: event.target.value }))}
                  className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary h-24 resize-none"
                  placeholder="Describe responsibilities, scope, and expectations."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-tertiary uppercase tracking-wide">Human checkpoint preference</label>
                <input
                  value={draft.checkpointPreference}
                  onChange={(event) => setDraft(prev => ({ ...prev, checkpointPreference: event.target.value }))}
                  className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="e.g. Ask before final output and after first draft"
                />
                <div className="text-xs text-text-tertiary">
                  Prompts that remind the apprentice to check in deliberately.
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-tertiary uppercase tracking-wide">Suggested skills</label>
                <input
                  value={draft.suggestedSkills}
                  onChange={(event) => setDraft(prev => ({ ...prev, suggestedSkills: event.target.value }))}
                  className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="Comma separated skills to use when needed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-tertiary uppercase tracking-wide">Suggested MCPs</label>
                <input
                  value={draft.suggestedMcps}
                  onChange={(event) => setDraft(prev => ({ ...prev, suggestedMcps: event.target.value }))}
                  className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="Comma separated MCPs to consult when needed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-tertiary uppercase tracking-wide">Tags</label>
                <input
                  value={draft.tags}
                  onChange={(event) => setDraft(prev => ({ ...prev, tags: event.target.value }))}
                  className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-xs text-text-primary"
                  placeholder="Comma separated tags"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-text-tertiary uppercase tracking-wide">
                    Ideal output format (optional)
                  </label>
                  <label className="text-xs text-text-secondary flex items-center gap-2 cursor-pointer">
                    <CloudArrowUp size={14} />
                    Upload files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleUploadFiles}
                    />
                  </label>
                </div>
                {draft.verificationFiles.length === 0 ? (
                  <div className="text-xs text-text-tertiary bg-bg-tertiary border border-dashed border-border rounded-md px-3 py-3">
                    Upload reference outputs to teach the agent what good looks like.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {draft.verificationFiles.map(file => (
                      <div
                        key={file.id}
                        className="bg-bg-tertiary border border-border rounded-md p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{file.fileName}</span>
                          <button
                            type="button"
                            onClick={() => removeVerificationFile(file.id)}
                            className="p-1 rounded text-text-tertiary hover:text-text-primary"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                        <textarea
                          value={file.learnings}
                          onChange={(event) => updateVerificationFile(file.id, event.target.value)}
                          className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-xs text-text-primary h-20 resize-none"
                          placeholder="Describe what the agent should learn from this output."
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-xs bg-brand hover:bg-brand/90 text-white rounded-md flex items-center justify-center gap-2"
              >
                {isEditing ? <Check size={14} /> : <Plus size={14} />}
                {isEditing ? 'Save apprentice profile' : 'Create apprentice profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
