---
description: Systematic local debugging workflow (data → API → server → browser)
allowed-tools: Bash, Read, Grep, Glob, Task, TodoWrite, mcp__graphiti-memory__add_memory, mcp__chrome-devtools__*, mcp__postgres-kismet-infra__*
---

# Debug Local Development Environment

Systematic debugging workflow that traces issues from database layer through API and server to browser rendering.

**Environment:**
- Frontend: http://localhost:3000 (kismet.travel repo)
- Backend API: http://localhost:9091 (kismet-infrastructure repo)
- Database: Dev database (accessible via Infra MCP tools)
- Browser: Chrome DevTools (requires setup via `/chrome-debug` first)

**Test Credentials:**
- API Key: `test-api-key-123` (header: `X-API-Key`)
- Test Tenant ID: `94ae6d2b-d7c8-4453-bee8-fc9143cb62b2`

---

## Debugging Workflow (Execute in Order)

### Step 1: Database Layer - Verify Data Exists

**Goal:** Confirm the data exists in the database before checking if it flows through the system.

**Tools:** Infra MCP (postgres-kismet-infra)

**Actions:**
1. Use `mcp__postgres-kismet-infra__list_schemas` to see available schemas
2. Use `mcp__postgres-kismet-infra__list_objects` to find relevant tables
3. Use `mcp__postgres-kismet-infra__get_object_details` to inspect table structure
4. Use `mcp__postgres-kismet-infra__execute_sql` to query data:
   ```sql
   -- Example: Check if hotel data exists
   SELECT * FROM hotels WHERE id = 'hotel-id' LIMIT 1;

   -- Example: Check related data with joins
   SELECT h.*, r.* FROM hotels h
   LEFT JOIN rooms r ON r.hotel_id = h.id
   WHERE h.id = 'hotel-id';
   ```

**What to verify:**
- ✅ Records exist for the feature being debugged
- ✅ Required fields are populated (not NULL or empty)
- ✅ Relationships are correct (foreign keys, joins work)
- ✅ Data format matches expected schema

**If data is missing:** Stop here and create/fix data first.

---

### Step 2: API Layer - Verify Data Flows Through Endpoints

**Goal:** Confirm the API endpoint returns the database data correctly.

**Tools:** Chrome DevTools Network Logs

**Setup (if not already done):**
1. Run `/chrome-debug` to launch Chrome with remote debugging
2. Navigate to the frontend page: `http://localhost:3000/[relevant-page]`
3. Use `mcp__chrome-devtools__list_network_requests` to see API calls

**Actions:**
1. Use `mcp__chrome-devtools__take_snapshot` to see current page state
2. Use `mcp__chrome-devtools__list_network_requests` to find API calls to `localhost:9091`
3. Use `mcp__chrome-devtools__get_network_request` to inspect specific requests:
   - Check request headers (X-API-Key, X-Tenant-ID)
   - Check response status (200 OK)
   - Check response body matches database data
   - Check response time (performance issues)

**Alternative - Direct API Testing:**
```bash
# Test backend API directly with curl
curl -H "X-API-Key: test-api-key-123" \
  -H "X-Tenant-ID: 94ae6d2b-d7c8-4453-bee8-fc9143cb62b2" \
  http://localhost:9091/v1/[endpoint] | jq '.'
```

**What to verify:**
- ✅ API request is being made to correct endpoint
- ✅ Response status is 200 OK
- ✅ Response data matches database data from Step 1
- ✅ Data shape/structure is correct (not empty objects)
- ✅ All required fields are present

**If API returns wrong data:** Check backend controller/service files.

---

### Step 3: Server Layer - Check Server Logs for Errors

**Goal:** Identify server-side errors, warnings, or unexpected behavior.

**Two Scenarios:**

#### A. Running Servers Locally (Can Read Logs Directly)

**Backend Logs (kismet-infrastructure on 9091):**
```bash
# If using Docker
docker logs kismet-infrastructure-container

# If running with npm/node, check terminal output where server started
# Or read log files if configured
```

**Frontend Logs (kismet.travel on 3000):**
```bash
# Check Next.js terminal output
# Look for errors, warnings, or API call logs
```

**What to check:**
- ✅ No 500 errors or exceptions
- ✅ API routes being hit successfully
- ✅ Database queries executing without errors
- ✅ No validation or schema errors
- ✅ Request/response logging (if enabled)

#### B. Cloud-Hosted Servers (Ask User for Logs)

If servers are running in cloud/container and logs aren't directly accessible:

**Ask user:** "To debug the server layer, I need to see server logs for the [specific endpoint/feature]. Can you provide:
1. Backend API logs from kismet-infrastructure (port 9091) for requests to [endpoint]
2. Any error messages or stack traces
3. Request/response logs if available

Specifically, I'm looking for logs around [timestamp] when the [action] was triggered."

**What to look for in user-provided logs:**
- ❌ Stack traces or exceptions
- ❌ Database connection errors
- ❌ Validation failures
- ❌ Timeout errors
- ⚠️ Warnings that might indicate issues

---

### Step 4: Browser Layer - Verify Data Renders Correctly

**Goal:** Confirm data reaches the browser and renders in the UI correctly.

**Tools:** Chrome DevTools Console Logs & DOM Inspection

**Actions:**
1. Use `mcp__chrome-devtools__list_console_messages` to check for errors:
   - JavaScript errors
   - React warnings
   - Failed fetch calls
   - Type errors

2. Use `mcp__chrome-devtools__take_screenshot` to see visual state

3. Use `mcp__chrome-devtools__take_snapshot` to inspect DOM elements:
   - Check if data is in the DOM but hidden (CSS issue)
   - Check if components are rendering (React issue)
   - Check if placeholder/empty states are showing

4. Cross-reference Network tab data with Console:
   - Did data arrive from API? (Step 2)
   - Is data being logged in console?
   - Are there client-side transformation errors?

**What to verify:**
- ✅ No console errors
- ✅ Data from API is being received by React components
- ✅ Components are rendering with correct props
- ✅ No empty states when data should be present
- ✅ UI matches expected design

**Common Issues:**
- **Data arrives but doesn't render:** Check React component props, state management
- **API call never made:** Check React Query/SWR hooks, useEffect dependencies
- **Caching issues:** Check fetch `cache: 'no-store'` settings
- **Type errors:** Check TypeScript definitions match API response

---

## After Debugging: Document Findings

### 1. Create Beads Issue
```bash
bd add "Debug [feature]: [symptom description]"
bd update [id] --comment "Root cause: [what you found]"
bd update [id] --comment "Solution: [what fixed it]"
```

### 2. Store Pattern in Graphiti
```typescript
mcp__graphiti-memory__add_memory({
  name: "Local Debug: [Feature] [Symptom]",
  episode_body: `
    Symptom: [What was wrong]
    Layer: [database/api/server/browser]
    Root Cause: [Technical issue found]
    Solution: [How it was fixed]
    Files Modified: [Paths and line numbers]
  `
})
```

### 3. Use `/beads-investigation` Command
For full structured documentation with timeline and learnings.

---

## Quick Reference

### Chrome Setup (Run First)
```bash
# Run this command to launch Chrome with remote debugging
/chrome-debug
```

### Test API Directly
```bash
curl -H "X-API-Key: test-api-key-123" \
  -H "X-Tenant-ID: 94ae6d2b-d7c8-4453-bee8-fc9143cb62b2" \
  http://localhost:9091/v1/[endpoint] | jq '.'
```

### Common Database Queries
```sql
-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check table structure
\d+ table_name

-- Sample data with limit
SELECT * FROM table_name LIMIT 5;
```

---

## Integration with Other Commands

- **Before debugging:** Create Beads issue (`bd add "Debug [feature]"`)
- **Chrome setup:** `/chrome-debug` (enables Chrome DevTools MCP)
- **After debugging:** `/beads-investigation` (structured documentation)
- **Full-stack debugging:** `/debug` (parallel investigation strategy)
- **Related:** See `.claude/commands/debug.md` for parallel debugging strategies

---

## Debugging Philosophy

**Trace from source to destination:**
1. Data exists? → Check database
2. Data accessible? → Check API
3. Data processed? → Check server logs
4. Data displayed? → Check browser

**Each layer builds on the previous:**
- No point checking API if data doesn't exist
- No point checking browser if API isn't returning data
- Server logs reveal what's happening between database and API

**Ask user when blocked:**
- Server logs not accessible? Ask user for excerpts
- Need specific test data? Ask user to create it
- Environment variables unclear? Ask user for confirmation
