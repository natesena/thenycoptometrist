---
description: Start new work with proper plan-first workflow
allowed-tools: AskUserQuestion, Task, Write, mcp__archon__manage_project, mcp__archon__manage_task, SlashCommand
---

# Start New Work

## Usage

```
/new <feature-request>, <bug-fix>, etc...
```

## What This Does

Orchestrates the complete workflow for starting new work:
1. Ensures plan mode is active
2. Discusses scope and requirements
3. Creates Archon project with tasks
4. Calls `/quick-worktree` to set up git worktrees
5. Prepares you to exit plan mode and implement

## Instructions

You are starting a new scope of work. Follow these steps carefully:

### Step 0: Plan Mode Check

⚠️ **CRITICAL**: Before proceeding, check if you are in plan mode.

If NOT in plan mode:
- **STOP immediately**
- Tell the user: "⚠️ Please enter plan mode before using `/new`. This ensures we plan properly before creating projects and worktrees."
- Wait for user to confirm they've entered plan mode
- Then continue with Step 1

If already in plan mode:
- Acknowledge: "✅ Plan mode active - proceeding with planning workflow"
- Continue to Step 1

### Step 1: Clarifying Questions → Describe Changes → Text Images → Repeat Until Agreement

**Phase A: Ask Questions**
- Use `AskUserQuestion` to understand requirements, scope, constraints

**Phase B: Research & Describe**
- Use Task agent (subagent_type='Explore') to research codebase
- Describe UI/UX changes and improvements
- Create text-based "before vs after" representations

**Phase C: Visual Text Images**
- Show proposed changes as text images (code snippets, UI mockups in text)
- Example: "Before: [current form layout]" → "After: [new form with currency dropdown]"

**Phase D: Iterate**
- Get user feedback
- Repeat A→B→C until user agrees on scope

**Goal:** Complete agreement on what will be built before creating documentation.

### Step 1.5: Quick Win Assessment

Ask: "Can we solve this quickly with a simple frontend change?"

**If YES (Frontend-Only Quick Win):**
- Plan frontend-only solution
- Light research (check existing patterns via Explore agent)
- Structure PRD for fast shipping
- Skip `/archon-research` - move quickly

**If NO (Backend Changes Needed):**
- Identify what shortens time-to-value
- Phase the work:
  - Phase 1: Quick frontend stub/prototype
  - Phase 2+: Backend enhancement with proper testing
- Use `/archon-research <task-id>` for complex, long-term work requiring deep pattern research (skip for quick UI tweaks)
- Backend changes need more testing - research deeply before implementing

**Planning Philosophy:**
- Frontend changes can be pushed quickly and iterated
- Backend changes have higher risk profile (DB schemas, APIs, migrations)
- Always look for the fastest path to delivering value
- Phase work to get something useful shipped fast, then enhance

### Step 2: Create PRD Document

After scope agreement, create a PRD document in `tmp/` directory:

**File naming:** `tmp/PRD-<project-name-slug>.md`

**PRD Structure:**
```markdown
# PRD: <Project Title>

## Overview
[Brief description of what we're building]

## Requirements
[Detailed requirements from Step 1 discussion]

## Phasing Strategy
[How work is phased for fast time-to-value]

### Phase 1: Quick Win (Frontend-only OR minimal backend)
- **Goal:** Ship working solution fast
- **Scope:** [What's included in Phase 1]
- **Timeline:** [Estimated - quick]

### Phase 2+: Enhancements (Optional - if backend needed)
- **Goal:** [What Phase 2 adds]
- **Scope:** [Backend changes, more robust solution]
- **Timeline:** [Can be deferred based on Phase 1 feedback]

## Technical Approach
[Based on research findings from Explore agent and/or `/archon-research`]

### Frontend Components
[What frontend changes are needed]

### Backend Components (if applicable)
[What backend changes are needed - note these require deeper research and testing]

## Implementation Tasks
### Phase 1 Tasks
1. [Task 1 title and description]
2. [Task 2 title and description]

### Phase 2 Tasks (Optional)
1. [Future enhancement task 1]
2. [Future enhancement task 2]

## Before/After Visual Representations
[Include text images from planning phase]

### Before:
```
[Current state representation]
```

### After (Phase 1):
```
[Phase 1 state representation]
```

### After (Phase 2 - Future):
```
[Final enhanced state representation]
```

## IMPLEMENTATION CHANGELOG
[Empty section - will be populated during implementation when decisions change]
```

### Step 3: Upload PRD to Archon

Upload the PRD document to Archon knowledge base:

```
/archon-upload tmp/PRD-<project-name-slug>.md
```

This makes the PRD searchable in future work and preserves planning context.

### Step 4: Create Archon Project

Once scope is agreed upon, create the Archon project:

```
mcp__archon__manage_project(
  action="create",
  title="<concise project title>",
  description="<detailed description of scope and approach>",
  github_repo="https://github.com/nathanielsena/kismet-infrastructure" // or kismet.travel if frontend-only
)
```

Save the returned `project_id` - you'll need it for the next steps.

### Step 5: Create Archon Tasks (Phase 1 + Long-term Vision)

Create detailed tasks for Phase 1 (immediate work) and ONE task for Phase 2+ (long-term vision).

**Phase 1 Tasks (Detailed):**

For each Phase 1 implementation step from the PRD, create a task:

```
mcp__archon__manage_task(
  action="create",
  project_id="<project-id>",
  title="<task title>",
  description="<detailed description with clear completion criteria>",
  status="todo",
  assignee="User",
  task_order=<priority 0-100, higher = more important>
)
```

**Phase 2+ Task (Single Summary Task):**

Create ONE task that captures the long-term vision:

```
mcp__archon__manage_task(
  action="create",
  project_id="<project-id>",
  title="Phase 2: [Long-term Enhancement]",
  description="Long-term vision from PRD:

  [Summary of Phase 2+ scope from PRD]

  This task will be broken into detailed subtasks after Phase 1 ships and we gather feedback.

  See PRD for full details: tmp/PRD-<project-name-slug>.md",
  status="todo",
  assignee="User",
  task_order=<lower priority than Phase 1 tasks>
)
```

**Task Guidelines:**
- Phase 1 tasks: 1-4 hours each, actionable now
- Phase 2 task: Placeholder for long-term vision, will be decomposed later
- Use task_order to show Phase 1 tasks come first
- Default assignee to "User" unless discussing multi-agent work

### Step 6: Call /quick-worktree

Now that the Archon project exists, create the git worktrees:

```
/quick-worktree <project-id>
```

This will:
- Determine which repos need worktrees based on project description
- Create properly named worktrees and branches
- Set up dependencies
- Update the Archon project with worktree locations

### Step 7: Spawn Orchestration Agent

After `/quick-worktree` completes, spawn a separate orchestration agent to manage parallel task execution.

**Spawn the orchestrator:**
```
Task(
  subagent_type="general-purpose",
  description="Orchestrate parallel task execution",
  prompt="""
  CONTEXT:
  - Project ID: <project-id>
  - PRD: tmp/PRD-<slug>.md
  - Worktree locations: <worktree-paths>

  YOUR MISSION:
  1. Fetch all tasks: mcp__archon__find_tasks(project_id="<project-id>")
  2. Analyze dependencies (review task descriptions)
  3. Group tasks:
     - Independent: Can run in parallel (different files/components, no shared state)
     - Sequential: Must run after other tasks complete
  4. Create TodoWrite orchestration plan tracking which agents to spawn
  5. Spawn all independent task agents in a SINGLE message for true parallelism
  6. Wait for parallel agents to complete
  7. Spawn sequential task agents after dependencies are satisfied

  AGENT SPAWNING:
  - Each task agent gets: PRD path + its specific Archon task context + worktree path
  - Instruct each agent to update Archon task status (todo→doing→review→done)
  - Use TodoWrite to track orchestration (not implementation details)

  COMPLETION:
  Report back with summary of what was orchestrated and current status.
  """
)
```

**This separates concerns:**
- `/new` handles planning and setup
- Orchestrator handles dependency analysis and agent spawning
- Task agents handle actual implementation

### Step 8: Ready to Implement

After spawning the orchestration agent:

1. **Summary**: Provide brief summary of what was created:
   - PRD document path
   - Archon project ID and title
   - Number of tasks created
   - Worktree locations
   - Orchestration agent spawned

2. **Remind about plan mode**: Tell the user:
   ```
   ✅ Planning complete! I've spawned an orchestration agent that will:
   - Analyze task dependencies
   - Spawn parallel agents for independent tasks
   - Manage sequential task execution

   When you're ready to start, exit plan mode.
   ```

3. **Wait**: Do NOT exit plan mode yourself - let the user control when to begin implementation

## Example Flow

```
User: /new
Claude: ✅ Plan mode active
[asks clarifying questions] → [researches codebase] → [shows before/after text images] → [iterates until agreement]
Claude: [creates PRD] → [uploads to Archon] → [creates project + tasks] → [calls /quick-worktree] → [spawns orchestrator agent] → ✅ Ready!

User: [exits plan mode]
Orchestrator: [analyzes dependencies] → [spawns 3 parallel task agents] → [monitors completion] → [spawns sequential tasks]
```

## Notes

- Primary entry point for ALL new work after `/clear`
- Plan mode MUST be active before using
- Calls `/quick-worktree` automatically - don't call it manually