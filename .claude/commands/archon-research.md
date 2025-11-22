---
description: Research task, create docs, upload to Archon, attach to task
argument-hint: <task-id>
allowed-tools: Read, Grep, Glob, Bash, mcp__archon__find_tasks, mcp__archon__manage_document, SlashCommand(/archon-upload:*)
---

# Research Task & Document to Archon

Research an Archon task, create comprehensive documentation, upload it to Archon's knowledge base, and attach the document to the task.

**Task ID:** `$ARGUMENTS`

## Your Task:

### Step 1: Validate Input & Get Task
1. Check that the user provided a task ID as an argument
2. If no argument provided, show usage: `/archon-research <task-id>`
3. Fetch the task details using `mcp__archon__find_tasks` with the task_id
4. Display task title and description to confirm with user

### Step 2: Launch Parallel Research Agents

**CRITICAL:** Launch ALL 4 research agents SIMULTANEOUSLY using multiple Task tool invocations in a SINGLE message. Do NOT launch them sequentially.

Launch these 4 specialized research agents in parallel:

#### Agent 1: RAG Knowledge Researcher
**Purpose:** Query existing knowledge from Archon RAG
**Tools:** `mcp__archon__rag_search_knowledge_base`, `mcp__archon__rag_search_code_examples`
**Task:**
- Search RAG for similar tasks and features we've built before
- Find established patterns related to this task
- Look for past decisions and learnings
- Identify conventions already documented
**Output file:** `tmp/archon-research/rag-findings-{project-uuid}.md`
**Content to include:**
- Similar past tasks found
- Established patterns we already use
- Past decisions that apply
- Existing conventions to follow

#### Agent 2: Codebase Researcher
**Purpose:** Investigate current codebase implementation
**Tools:** `Grep`, `Glob`, `Read`
**Task:**
- Find relevant files in the codebase
- Read current implementation
- Identify existing patterns and components
- Map dependencies
**Output file:** `tmp/archon-research/codebase-findings-{project-uuid}.md`
**Content to include:**
- Key files involved with line numbers
- Current implementation state
- Existing patterns in code
- Dependencies discovered

#### Agent 3: External Researcher
**Purpose:** Search for industry best practices
**Tools:** `WebSearch`, `WebFetch`
**Task:**
- Search web for best practices for this feature/task
- Find common industry patterns and approaches
- Look for potential pitfalls or anti-patterns to avoid
- Find recommended libraries or tools if applicable
**Output file:** `tmp/archon-research/external-findings-{project-uuid}.md`
**Content to include:**
- Industry best practices
- Recommended approaches from external sources
- Potential libraries or tools to consider
- Warnings or common mistakes to avoid

#### Agent 4: Pattern Analyzer
**Purpose:** Analyze codebase conventions and structure
**Tools:** `Glob`, `Read`, `Grep`
**Task:**
- Analyze file structure and naming conventions
- Identify code organization patterns
- Map common architectural patterns
- Document testing patterns
**Output file:** `tmp/archon-research/patterns-{project-uuid}.md`
**Content to include:**
- File structure conventions
- Naming patterns
- Architectural patterns
- Testing conventions

**Wait for ALL 4 agents to complete before proceeding to Step 3.**

### Step 3: Synthesize All Research Findings

After all 4 agents complete, read their output files and synthesize:

1. **Read all 4 research files:**
   - RAG findings (what we already know)
   - Codebase findings (current state)
   - External findings (industry practices)
   - Pattern analysis (our conventions)

2. **Cross-reference findings:**
   - Where does codebase align with RAG knowledge?
   - Where do external practices match our patterns?
   - What's NEW vs what confirms existing knowledge?

3. **Identify novel knowledge:**
   - New patterns not in RAG
   - New external best practices we haven't documented
   - New architectural insights
   - Decisions that differ from past approaches (with rationale)

4. **Prepare comprehensive synthesis:**
   - Current state (from codebase)
   - Established patterns (from RAG + patterns)
   - Best practices (from external + RAG)
   - Novel findings (what's new)
   - Proposed approach (informed by all sources)

### Step 4: Create Comprehensive Research Document

Using the synthesis from Step 3,
Create a comprehensive markdown file in `tmp/archon-research/`:

**Document Naming Convention:**
- Format: `<semantic-description>-<project-uuid>.md`
- Create kebab-case slug from task title (2-4 words max)
- Use project UUID (not task UUID) for consistency with worktree naming
- Example: `currency-dropdown-9de0f63d-22da-4e48-99bd-fb758834d376.md`

**File path:** `tmp/archon-research/<description-slug>-<project-uuid>.md`

**CRITICAL:** Extract both UUIDs from the task details (Step 1):
- Task UUID: The task ID provided as argument
- Project UUID: Found in task details as `project_id`
- Both must be included in the document for proper linking

**Document structure:**
```markdown
# Research: {Task Title}

## Metadata & Links (CRITICAL for Relations)

**Task UUID:** `{task-id}` (full UUID, not truncated)
**Project UUID:** `{project-id}` (full UUID, not truncated)
**Project Name:** {project name}
**Document Date:** {current date}
**Researcher:** Claude Code (4 parallel agents)

> **Why UUIDs Matter:** These UUIDs enable linking and understanding relations between:
> - This research document ↔ Archon task
> - This research document ↔ Archon project
> - Future PRDs/Beads issues ↔ This research
> - Knowledge graph connections in RAG
>
> Always include COMPLETE UUIDs (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) for reliable cross-referencing.

## Task Overview
{Brief summary of the task from Archon}

---

## Knowledge Sources

### From Archon RAG (Existing Knowledge - INPUT)
**Source:** Agent 1 - RAG Knowledge Researcher

- **Similar past tasks:**
  - Task XYZ: {summary and link}

- **Established patterns we use:**
  - Pattern A: {description}
  - Convention B: {description}

- **Past decisions that apply:**
  - Decision made in task ABC: {what and why}

- **Existing conventions to follow:**
  - {Convention from past work}

### From Codebase Analysis (Current State - INPUT)
**Source:** Agent 2 - Codebase Researcher

- **Key files involved:**
  - `file/path.ts:123-456` - Description
  - `another/file.tsx:789` - Description

- **Current implementation:**
  {What exists today}

- **Dependencies:**
  - Technical: {libraries, APIs, services}
  - Task: {blockers, related work}
  - Data: {schemas, migrations}

### From External Research (Industry Best Practices - INPUT)
**Source:** Agent 3 - External Researcher

- **Industry best practices:**
  - {Best practice 1 from web search}
  - {Best practice 2}

- **Recommended approaches:**
  - {Approach found externally}

- **Tools/Libraries to consider:**
  - {Recommended tool}

- **Warnings & Anti-patterns:**
  - Avoid X because Y

### From Pattern Analysis (Our Conventions - INPUT)
**Source:** Agent 4 - Pattern Analyzer

- **File structure conventions:**
  - {How we organize files}

- **Naming patterns:**
  - {How we name things}

- **Architectural patterns:**
  - {How we structure code}

- **Testing conventions:**
  - {How we test}

---

## Novel Findings (NEW Knowledge - OUTPUT)

### New Patterns Discovered
- {Pattern not previously in RAG or codebase}

### New External Best Practices
- {External finding not previously documented in our RAG}

### New Architectural Insights
- {Insights from this research not captured before}

### Decisions Different from Past Approaches
- {Why we're deviating from established patterns, if applicable}
- Rationale: {explain why}

---

## Synthesis & Recommendations

### Cross-Referenced Findings
- **Codebase aligns with RAG:** {where they match}
- **External practices match our patterns:** {where they align}
- **Gaps identified:** {where we need to improve}

### Proposed Implementation

**Approach:** {Recommended strategy informed by all 4 research sources}

**Files to Create/Modify:**
- `path/to/file.ts` - {what changes needed}
- `path/to/another.tsx` - {what changes needed}

**Implementation Steps:**
1. {Step 1}
2. {Step 2}
3. {Step 3}

**Estimated Complexity:**
- **Time estimate:** {hours}
- **Risk level:** Low/Medium/High
- **Backend changes required:** Yes/No

### Testing Strategy
- {How to test the implementation}
- {What edge cases to cover}

### Next Steps
1. {Immediate next action}
2. {Follow-up actions}

---

## Research Artifacts
- RAG findings: `tmp/archon-research/rag-findings-{project-uuid}.md`
- Codebase findings: `tmp/archon-research/codebase-findings-{project-uuid}.md`
- External findings: `tmp/archon-research/external-findings-{project-uuid}.md`
- Pattern analysis: `tmp/archon-research/patterns-{project-uuid}.md`

---
*Generated by /archon-research command with 4 parallel research agents*
```

### Step 5: Save the Research Document
Write the markdown file to the filesystem at the path specified above.

### Step 6: Upload ONLY New Knowledge to Archon RAG

**IMPORTANT:** Only upload novel findings to prevent polluting RAG with duplicate information.

1. **Extract new knowledge section** from the research document:
   - Create a filtered file: `tmp/archon-research/new-knowledge-{project-uuid}.md`
   - **MUST include at top:** Task UUID, Project UUID, and Project Name (for linking)
   - Include ONLY the "Novel Findings" section from the main research doc
   - Include the task overview for context
   - Include cross-references to full research doc (with UUIDs)

2. **Upload the filtered document:**
   - Use SlashCommand tool with: `/archon-upload tmp/archon-research/new-knowledge-{project-uuid}.md`
   - Do NOT upload the full research doc (contains duplicate info from RAG)
   - Do NOT wait for user confirmation - upload automatically
   - Capture the **source ID** returned

3. **Why filter?**
   - Agent 1 already pulled existing knowledge from RAG (INPUT)
   - No need to re-upload what we already know
   - Only novel findings extend the knowledge base (OUTPUT)
   - Keeps RAG clean and prevents duplicate search results

### Step 7: Attach Document to Archon Task
Use `mcp__archon__manage_document` to create a document linked to the task's project:

1. Get the project_id from the task details (from Step 1)
2. Create a new document with:
   - **action:** "create"
   - **project_id:** {from task}
   - **title:** "Research: {task title}"
   - **document_type:** "spec"
   - **content:** JSON object containing:
     - `research_file_path`: Path to the local markdown file
     - `archon_rag_source_id`: Source ID from Archon upload
     - `task_id`: The Archon task ID
     - `summary`: Brief summary of findings
   - **tags:** ["research", "archon-task", task-id]

3. Capture the document ID returned

### Step 8: Update Task Description
Update the task description to reference the research document:

Use `mcp__archon__manage_task` to update the task:
- **action:** "update"
- **task_id:** {task-id}
- **description:** Append to existing description:
  ```

  ---

  ## Research Documentation
  - Local file: `tmp/archon-research/{description-slug}-{project-uuid}.md`
  - Archon document: {document-id}
  - RAG source: {source-id}
  - Research date: {date}
  ```

### Step 9: Report Success
Display a comprehensive summary:

```
✅ Research & Documentation Complete!

Task: {task title}
Task ID: {task-id}

📄 Research Document Created:
   Local: tmp/archon-research/{description-slug}-{project-uuid}.md

🔍 Uploaded to Archon RAG:
   Source ID: {source-id}
   Searchable via: rag_search_knowledge_base()

📎 Attached to Archon Project:
   Document ID: {document-id}
   Project: {project name}

📝 Task Updated:
   Description includes links to research

Next Steps:
{List immediate next actions from the research}
```

## Error Handling

If any step fails:
1. Report which step failed
2. Provide the partial work completed
3. Save the research document locally even if upload fails
4. Suggest manual steps to complete

## Examples:

```bash
/archon-research 11e31df6-2243-4339-aaf5-3d8386b24bd5
/archon-research fc120668-e8f4-460c-9359-f9e4d09eab42
```

## Notes:

- Research documents are preserved locally even if Archon upload fails
- The RAG upload makes research searchable for future tasks
- Linking documents to tasks prevents losing research context
- All research is dated and attributed for future reference
- Research documents can be referenced in PRDs and implementation plans
