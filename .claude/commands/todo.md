---
description: Show projects with outstanding work - what to work on next
allowed-tools: mcp__archon__find_projects, mcp__archon__find_tasks, Task
---

# What To Do Next - Outstanding Work Summary

Find all Archon projects with incomplete tasks and provide succinct summaries to help you decide what to work on next.

## Architecture:

**Phase 1: Discovery** (you do this)
- Use `mcp__archon__find_projects` to get all projects
- Use `mcp__archon__find_tasks` to check each project for open tasks
- Identify projects with incomplete work

**Phase 2: Parallel Analysis** (launch agents)
- Launch one research agent PER PROJECT with open tasks
- Each agent analyzes its assigned project independently
- Agents run in parallel to save time

**Phase 3: Synthesis** (you do this)
- Collect all agent reports
- Synthesize into final summary
- Present to user in scannable format

## Your Task:

### Step 1: Find Projects with Open Work

1. Call `mcp__archon__find_projects(per_page=50)` to get all projects
2. **Filter out completed projects**: Skip projects where description starts with "✅ COMPLETED" or "STATUS: COMPLETED"
3. For each remaining project, call `mcp__archon__find_tasks(project_id=X, include_closed=false)` to check for incomplete tasks
4. Build a list of projects that have at least 1 task with status: todo, doing, or review
5. Sort by `updated_at` (most recent first)

### Step 2: Launch Parallel Research Agents

**CRITICAL**: Launch ALL agents in a SINGLE message using multiple Task tool invocations in parallel.

For each project with open tasks, launch a general-purpose research agent with this prompt:

```
Analyze Archon project: {project_title}

Project ID: {project_id}
Last Updated: {updated_at}

Your task: Create a succinct 3-line summary of this project's outstanding work.

**Available data:**
- Project details: Already provided above
- Tasks: Use mcp__archon__find_tasks(project_id="{project_id}", include_closed=false)

**Output format (exactly 3 lines):**

Line 1: **What & Why** - What is this project trying to accomplish? (1 sentence)
Line 2: **Status** - What's the current state? ({X} todo, {Y} doing, {Z} review)
Line 3: **Next Action** - What should happen next to move this forward? (1 sentence)

**Rules:**
- Keep each line under 80 characters
- Be specific and actionable
- Focus on "what needs to happen" not "what has been done"
- If tasks are in "doing" or "review", prioritize those in the summary
- If >5 tasks, group by theme/feature instead of listing individually

**Example output:**

**What & Why**: Add photo thumbnails to coverage cards following rooms/current pattern
**Status**: 0 tasks (research complete, ready for implementation)
**Next Action**: Create implementation tasks based on research findings

Return ONLY these 3 lines. No additional commentary.
```

### Step 3: Wait for All Agents to Complete

Collect the 3-line summary from each agent.

### Step 4: Synthesize Final Summary

Organize agent reports into this format:

```
# Outstanding Work - {current_date}

Found **{X} projects** with incomplete tasks ({Y} total tasks)

---

## 🔥 Active Work (doing/review)

{Projects with tasks in 'doing' or 'review' status - immediate attention needed}

### {Project Title}
**UUID**: `{project_id}`
**Updated**: {relative_date}

{Agent's 3-line summary}

---

## 📋 Ready to Start (todo only)

{Projects with only 'todo' tasks - organized by recency}

### {Project Title}
**UUID**: `{project_id}`
**Updated**: {relative_date}

{Agent's 3-line summary}

---

## 📊 Quick Stats

**Active**: {count} projects with work in progress
**Blocked/Review**: {count} projects awaiting validation
**Ready**: {count} projects ready to start
**Total Tasks**: {X} todo, {Y} doing, {Z} review

**Suggested Next Steps:**
1. {Most urgent project based on status and recency}
2. {Quick win - project with 1-2 simple tasks}
3. {Longest stale project - needs attention}
```

## Formatting Rules:

1. **Group by urgency**: Active work first, then ready-to-start
2. **Relative dates**: "2 days ago", "Updated today", "Last week"
3. **Color coding**: 🔥 for active, 📋 for todo, ✅ for review-only
4. **Stale marking**: Projects not updated in >30 days get "(stale)" tag
5. **Concise**: Each project = 4 lines max (title + 3-line summary)

## Example Agent Launch:

```
SINGLE MESSAGE WITH MULTIPLE AGENTS:

Task 1: Analyze "Fix Header Auth Bug" project
Task 2: Analyze "Storefront Current Section" project
Task 3: Analyze "Room Archiving" project
... (all projects in parallel)
```

## Error Handling:

If no projects have outstanding tasks:
```
✅ All caught up! No projects have outstanding work.

Ready to start something new? Try:
- /archon-research <task-id> - Research a specific task
- Create a new project with mcp__archon__manage_project
```

## Notes:

- Parallel agents prevent context bloat
- Each agent analyzes independently (isolated context)
- Main session only does coordination and synthesis
- User gets scannable summary without drowning in details
- Can dive deeper into specific projects after seeing overview
