---
description: Create git worktrees for quick fixes and feature work
argument-hint: <archon-project-id>
allowed-tools: Read, Bash, mcp__archon__find_projects, mcp__archon__manage_project
---

# Quick Worktree Setup

⚠️ **For new work, use `/new` instead** - it handles planning, project creation, and calls this command automatically.

## Usage

```
/quick-worktree <archon-project-id>
```

## What This Does

Creates git worktrees for an existing Archon project. Typically called by `/new` command, but can be used standalone if you already have a project ID.

## Instructions

You are in quick worktree setup mode. Follow these steps:

### Step 1: Get Archon Project Details

1. Fetch the project from Archon using `mcp__archon__find_projects(project_id="<project-id>")`
2. Extract:
   - Project UUID
   - Project title
   - Project description

### Step 2: Determine Repository Scope

Based on the project description, determine which repositories need worktrees:

- **Frontend changes** (UI, forms, pages): `kismet.travel`
- **Backend changes** (API, database, services): `kismet-infrastructure`
- **Both**: Both repositories

If unclear, ask the user which repo(s) to use.

### Step 3: Create Description Slug

From the project title, create a kebab-case description:

- Remove special characters
- Convert to lowercase
- Use hyphens between words
- Keep it concise (2-4 words max)

Example: "Add currency dropdown" → "currency-dropdown"

### Step 4: Determine Branch Type

Based on project title/description:

- New features → `feature`
- Bug fixes → `fix`
- Refactoring → `refactor`

### Step 5: Create Worktrees

For each required repository, execute:

#### For kismet.travel:

```bash
cd /Users/nathanielsena/Documents/code/Kismet/kismet.travel
git fetch origin main
git worktree add ../kismet.travel-<project-uuid>-<description> -b <type>/<project-uuid>-<description> origin/main

# IMPORTANT: Copy .env.local to the worktree (contains correct test API key)
cp .env.local ../kismet.travel-<project-uuid>-<description>/.env.local

# Install dependencies (requires --legacy-peer-deps)
cd ../kismet.travel-<project-uuid>-<description>
npm install --legacy-peer-deps
```

#### For kismet-infrastructure:

```bash
cd /Users/nathanielsena/Documents/code/Kismet/kismet-infrastructure
git fetch origin main
git worktree add ../kismet-infrastructure-<project-uuid>-<description> -b <type>/<project-uuid>-<description> origin/main

# IMPORTANT: Copy the .env file (NOT .env.local) to the worktree
cp api/hotels-api-ts/.env ../kismet-infrastructure-<project-uuid>-<description>/api/hotels-api-ts/.env

# Install dependencies for hotels-api-ts
cd ../kismet-infrastructure-<project-uuid>-<description>/api/hotels-api-ts
npm install
```

### Step 6: Update Archon Project

Update the project data to document worktree locations:

```
mcp__archon__manage_project(
  action="update",
  project_id="<project-uuid>",
  description="<existing-description>\n\nWorktrees:\n- kismet.travel-<project-uuid>-<description>\n- kismet-infrastructure-<project-uuid>-<description>"
)
```

### Step 7: Report Success

Provide user with:

- ✅ Worktree locations created
- ✅ Branch names
- ✅ Archon project updated with worktree info
- 📝 Next steps: cd into worktree directory to start work

## Example Output

```
✅ Worktrees created successfully!

kismet.travel worktree:
  Location: /Users/nathanielsena/Documents/code/Kismet/kismet.travel-f277d882-bd02-4f1b-8bb4-a4306ea60dbb-publish-button-fix
  Branch: fix/f277d882-bd02-4f1b-8bb4-a4306ea60dbb-publish-button-fix

kismet-infrastructure worktree:
  Location: /Users/nathanielsena/Documents/code/Kismet/kismet-infrastructure-f277d882-bd02-4f1b-8bb4-a4306ea60dbb-publish-button-fix
  Branch: fix/f277d882-bd02-4f1b-8bb4-a4306ea60dbb-publish-button-fix

✅ Archon project updated with worktree info

Next steps:
  cd kismet.travel-f277d882-bd02-4f1b-8bb4-a4306ea60dbb-publish-button-fix
```

## Notes

- This command is for lighter-weight work that doesn't require full PRD planning
- Follow git workflow conventions from `.claude/SOP/GIT_WORKFLOW.md`
- Always branch from latest `main`
- Use consistent naming across repositories for multi-repo features
