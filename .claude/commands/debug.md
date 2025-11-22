---
description: Full-stack debugging with parallel investigation strategies
allowed-tools: Bash, Read, Grep, Glob, Task, TodoWrite, mcp__graphiti__add_memory, mcp__chrome-devtools__*
---

# Full-Stack Debugging

Systematic investigation methods for debugging issues across backend, database, proxy, and frontend layers.

**Key Principle:** Run investigations in parallel for faster debugging. Launch multiple Task agents simultaneously.

---

## Before You Start

1. **Beads Issue:** Create or reference a Beads issue to track investigation (e.g., `bd add "Debug [feature]: [symptom]"`)
2. **Identify Target:** What feature/endpoint are you debugging?
3. **Choose Strategy:** Parallel (multiple agents) or sequential (one layer at a time)

---

## 4 Investigation Layers

### 1. Backend API (Port 9091)

**Method:** Test infrastructure API directly with curl

```bash
curl -H "X-API-Key: test-api-key-123" \
  http://localhost:9091/v1/storefronts/{id}/current | jq '.'
```

**What to check:**
- Response status (200 OK)
- Data shape matches expected schema
- Fields are populated (not empty objects)
- Timestamps, IDs, relationships correct

**Files to read:** Controller and service files for the endpoint

---

### 2. Database Layer

**Method:** Query database tables directly or use Prisma Studio

```bash
# Prisma Studio (GUI)
cd api/hotels-api-ts && npx prisma studio

# Direct queries
psql $DATABASE_URL -c "SELECT * FROM storefront_assets LIMIT 5;"
```

**What to check:**
- Tables contain expected data
- Relationships properly defined (foreign keys)
- Prisma `include` statements load related data
- No orphaned records or missing joins

**Files to read:** Prisma schema, service files with queries

---

### 3. Proxy Route (Port 3000)

**Method:** Test Next.js API routes

```bash
curl http://localhost:3000/api/storefronts/{id}/current | jq '.'
```

**What to check:**
- Proxy response matches backend API response
- Headers forwarded correctly (X-API-Key, X-Tenant-ID)
- Environment variables set (KISMET_INFRASTRUCTURE_API_URL)
- No caching issues (`cache: 'no-store'`, `dynamic = 'force-dynamic'`)

**Files to read:** Next.js API route files in `app/api/`

---

### 4. Frontend (Chrome DevTools)

**Method:** Browser inspection with remote debugging

**Setup:** Use `/chrome-debug` command first to launch Chrome on port 9222

**What to check:**
- Network tab shows successful API calls
- Response data correct in Network tab
- React DevTools: components receive correct props
- Console: no errors or warnings
- UI renders data (no empty states)

**Tools:** `mcp__chrome-devtools__*` tools (take_snapshot, list_network_requests, get_console_message)

---

## Debugging Strategies

### Parallel Investigation (Recommended)

Launch multiple Task agents to investigate simultaneously:

```typescript
// Launch 4 agents in one message (parallel execution)
Task 1: "Test backend API GET /v1/storefronts/{id}/current on port 9091.
         Verify response has populated asset objects with all fields."

Task 2: "Query database: storefront_assets and assets tables.
         Verify data exists and relationships are correct."

Task 3: "Test Next.js proxy /api/storefronts/[id]/current on port 3000.
         Compare response to backend, check headers and env vars."

Task 4: "Use Chrome DevTools to inspect Current section page.
         Check network calls, component props, and rendering."
```

**When to use:** Initial investigation, unknown issues, time-sensitive debugging

---

### Sequential Investigation

Check layers one at a time to build context:

**Common patterns:**
- **Data issue:** Database → Backend → Proxy → Frontend
- **API issue:** Backend → Proxy → Frontend → Database
- **UI issue:** Frontend → Proxy → Backend → Database

**When to use:** Known failing layer, teaching debugging, documenting process

---

## After Investigation

### 1. Document Findings

Use `/beads-investigation` command to create structured documentation:
- Problem description
- Investigation timeline (Test/Method/Result/Finding)
- Root cause analysis
- Solution implemented
- Files modified
- Learnings for future

### 2. Store Patterns in Graphiti

Save debugging patterns for future reference:

```typescript
mcp__graphiti__add_memory({
  name: "[Feature] [Symptom]",
  episode_body: `
    Symptom: [What user saw]
    Root Cause: [Technical issue]
    Solution: [What fixed it]
    Files: [Paths to modified files]
    Layer: [backend/database/proxy/frontend]
  `
})
```

**Example:**
```
Symptom: API returns empty objects in items array
Root Cause: Added JSON.parse(JSON.stringify()) serialization that broke Prisma objects
Solution: Remove serialization, return Prisma objects directly (matches codebase pattern)
Files: api/hotels-api-ts/src/routes/storefronts.ts (lines 302-308, 360-363)
Layer: backend
```

### 3. Update PRD

If debugging revealed implementation gaps or changes:
- Add to PRD CHANGELOG section
- Link Beads issue ID
- Document decision and reasoning

---

## Common Debugging Scenarios

### Empty Objects in API Response
1. Check backend: Is service returning data?
2. Check serialization: Are Prisma objects being serialized incorrectly?
3. Check response schema: Does Fastify schema filter fields?

### Data Not Appearing in UI
1. Check frontend: Does network tab show API call?
2. Check proxy: Does response match backend?
3. Check backend: Is data being returned?
4. Check database: Does data exist?

### Publish Toggle Not Working
1. Check frontend: Is API call being made?
2. Check proxy: Is it forwarding correctly?
3. Check backend: Is status being updated?
4. Check database: Is record persisted?
5. Check caching: Add `cache: 'no-store'` to fetch calls

---

## Test Configuration

**Ports:**
- Infrastructure API: 9091
- Next.js: 3000
- Chrome DevTools: 9222

**Test API Key:** `test-api-key-123`

**Test Tenant ID:** `94ae6d2b-d7c8-4453-bee8-fc9143cb62b2`

---

## Integration with Other Commands

- **Before debugging:** Create Beads issue (`bd add`)
- **Chrome setup:** `/chrome-debug` (sets up remote debugging)
- **After debugging:** `/beads-investigation` (documents findings)
- **PRD updates:** Reference files in `.claude/tasks/{feature}/README.md`
- **Archon tasks:** Link to parent task with `/archon-research`
