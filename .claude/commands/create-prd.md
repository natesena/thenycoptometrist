# Create PRD

## Step 0: Create Archon Task and Worktrees

Before starting the PRD process, set up the complete workspace:

### 0a: Create Archon Task

1. **Ask user for feature details:**
   - Feature name (concise, 2-5 words)
   - Brief description (1-2 sentences about the goal)

2. **Create Archon task:**
   ```
   Use mcp__archon__manage_task with:
   - action: "create"
   - title: [feature name from user]
   - description: [brief description from user]
   - status: "todo"
   ```

3. **Capture the task UUID** - This will be used for everything (worktrees, research, PRD)

### 0b: Determine Repository Scope

Based on the feature description, determine which repositories need work:

- **Frontend changes** (UI, pages, components, Next.js) → `kismet.travel`
- **Backend changes** (API, database, Prisma, services) → `kismet-infrastructure`
- **Both** (full-stack feature) → both repositories

If unclear from description, ask the user which repo(s) to use.

### 0c: Create Description Slug

From the task title, create a kebab-case slug:
- Remove special characters
- Convert to lowercase
- Use hyphens between words
- Keep concise (2-4 words max)

**Examples:**
- "Add room booking feature" → `room-booking`
- "Fix currency dropdown bug" → `currency-dropdown-fix`
- "Refactor amenities display" → `amenities-refactor`

### 0d: Determine Branch Type

Based on task title/description:
- New features → `feature`
- Bug fixes → `fix`
- Refactoring → `refactor`

### 0e: Create Worktrees

**IMPORTANT:** Create worktrees for each required repository. All subsequent work happens IN the worktree directories.

**⚠️ Worktrees share `.git` but NOT:**
- `node_modules/` (needs separate `npm install`)
- `.env` files (gitignored, must be copied)
- Build artifacts (`dist/`, etc.)

**For kismet.travel (if needed):**
```bash
cd /Users/nathanielsena/Documents/code/Kismet/kismet.travel
git fetch origin main
git worktree add ../kismet.travel-<task-uuid>-<description-slug> -b <type>/<task-uuid>-<description-slug> origin/main

# Setup the worktree for development
cd ../kismet.travel-<task-uuid>-<description-slug>

# Copy .env.local file
cp /Users/nathanielsena/Documents/code/Kismet/kismet.travel/.env.local .env.local

# Install dependencies
npm install

# Verify setup
npm run dev  # Should start without errors (Ctrl+C to stop)
```

**For kismet-infrastructure (if needed):**
```bash
cd /Users/nathanielsena/Documents/code/Kismet/kismet-infrastructure
git fetch origin main
git worktree add ../kismet-infrastructure-<task-uuid>-<description-slug> -b <type>/<task-uuid>-<description-slug> origin/main

# Setup the worktree for development
cd ../kismet-infrastructure-<task-uuid>-<description-slug>/api/hotels-api-ts

# Copy .env file (or use backup)
if [ -f /Users/nathanielsena/Documents/code/Kismet/kismet-infrastructure/api/hotels-api-ts/.env ]; then
  cp /Users/nathanielsena/Documents/code/Kismet/kismet-infrastructure/api/hotels-api-ts/.env .env
else
  cp .env.dev-backup .env
fi

# Install dependencies
npm install

# Verify setup
npm run dev:raw  # Should start without errors (Ctrl+C to stop)
```

**Example:**
- Task UUID: `abc-def-123-456`
- Slug: `room-booking`
- Type: `feature`
- Worktree: `kismet-infrastructure-abc-def-123-456-room-booking/`
- Branch: `feature/abc-def-123-456-room-booking`

**✅ Checklist before proceeding:**
- [ ] Worktree created and branch checked out
- [ ] `.env` file copied and exists in worktree
- [ ] `npm install` completed successfully
- [ ] Dev server starts without dependency errors

### 0f: Update Archon Task with Worktree Info

```
Use mcp__archon__manage_task with:
- action: "update"
- task_id: <task-uuid>
- status: "doing"
- description: "<existing-description>\n\n## Worktrees Created\n- kismet.travel-<uuid>-<slug>\n- kismet-infrastructure-<uuid>-<slug>"
```

### 0g: Set Working Directory

**CRITICAL:** Change to the appropriate worktree directory for all subsequent work:

- **Backend-focused features:** `cd kismet-infrastructure-<uuid>-<slug>`
- **Frontend-focused features:** `cd kismet.travel-<uuid>-<slug>`
- **Full-stack features:** Start with backend worktree

All PRD files, research, and code changes will be created IN the worktree on the feature branch.

---

## PRD Creation Process

**Working Directory:** You should now be in the worktree directory.

Follow these steps methodically:

## Step 1: Turn on Plan Mode
Enable plan mode in Claude Code to prevent premature implementation.

## Step 2: Research with `/archon-research`

**Launch parallel research agents:**

```bash
/archon-research <task-uuid>
```

This command will:
- Launch 4 specialized research agents IN PARALLEL:
  1. RAG Knowledge Researcher - queries existing knowledge from past work
  2. Codebase Researcher - investigates current implementation
  3. External Researcher - searches web for best practices
  4. Pattern Analyzer - documents codebase conventions
- Save findings to `/Users/nathanielsena/Documents/code/Kismet/.claude/tasks/archon-research/task-<uuid>-*.md`
- Upload ONLY new knowledge to Archon RAG (prevents duplicates)
- Return synthesized findings

**Why research first:**
- Grounds work in what we already know (RAG query)
- Parallel execution is 5x faster than sequential
- Comprehensive coverage (codebase + external + patterns)
- Knowledge accumulates automatically

## Step 3: Investigate Existing Database Schemas

**CRITICAL:** Read entire Prisma schema FIRST (if backend work):

```bash
# In worktree directory
cat prisma/schema.prisma
```

Cross-reference with research findings from Step 2:
- Which models already exist?
- What relationships are relevant?
- What patterns should we follow?

## Step 4: Generate High-Level PRD

Based on research findings and schema investigation, create main PRD:

**Save to:** `/Users/nathanielsena/Documents/code/Kismet/.claude/tasks/<feature-slug>/<feature-slug>-README.md`

**IMPORTANT:** The `.claude/tasks/` directory is in the MAIN Kismet folder, NOT in the worktree. This keeps all documentation centralized.

**Include:**
1. **Archon Task ID** at the top (link to task)
2. Problem statement
3. Goals and success metrics (brief)
4. User stories (brief)
5. Technical architecture (informed by research)
6. Implementation plan with component breakdown

**PRD Header:**
```markdown
# [Feature Name] - PRD

**Archon Task ID:** <task-uuid>
**Created:** <date>
**Status:** Planning
**Worktrees:**
- kismet.travel-<uuid>-<slug>
- kismet-infrastructure-<uuid>-<slug>

**Branch:** <type>/<uuid>-<slug>

---
```

## Step 5: Understand Tracking Tools

**Beads** - For implementation-level tracking (use this for PRD):
- Discrete implementation steps
- Dependencies between steps
- What's ready to work on

**Archon** - For high-level feature tracking (already created in Step 0):
- Multi-week features
- Cross-team coordination
- NOT for micro-tasks

## Step 6: Create Component-Specific Plans

For each component, create detailed sub-plans (use sub-agents):

**Save to:** `/Users/nathanielsena/Documents/code/Kismet/.claude/tasks/<feature-slug>/<component-name>.md`

**IMPORTANT:** Save to main Kismet `.claude/tasks/` folder, NOT in worktree.

Include surgical precision:
- Exact files and line numbers (in worktree)
- Specific code changes
- Test cases

## Step 7: Create Beads Issues

After components are planned:

```bash
bd create --title "Component 1" --body "Per PRD component 1"
bd create --title "Component 2" --body "Per PRD component 2"
# ... etc

# Add dependencies
bd dep add <later-id> <earlier-id>
```

**Link Beads IDs back to PRD:**
```markdown
## Implementation Steps
1. [Beads #42] Component 1
2. [Beads #43] Component 2 (depends on #42)
```

## Step 8: Review Complete Plan

Verify:
- [ ] All research checkboxes are [x]
- [ ] All decisions documented
- [ ] Archon task ID in PRD
- [ ] Worktree branches created
- [ ] All work in worktree directory
- [ ] Beads issues created and linked
- [ ] API design is RESTful

## Step 9: Confirm Ready for Implementation

Check final PRD against requirements in `.claude/SOP/PRD_CREATION.md`.

**You are now ready to implement!**

All work happens:
- In the worktree directory
- On the feature branch
- Tracked via Beads issues
- Linked to Archon task

When complete, create PR from feature branch.
