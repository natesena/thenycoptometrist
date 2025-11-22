---
description: Systematic staging environment debugging (Vercel + Production Backend)
allowed-tools: Bash, Read, Grep, Glob, Task, TodoWrite, mcp__graphiti-memory__add_memory, mcp__chrome-devtools__*
---

# Debug Staging Environment

Systematic debugging workflow for staging deployments on Vercel connected to production backend.

**IMPORTANT: Always run in MANUAL MODE when debugging staging.**

**Environment:**
- Frontend: Vercel deployment URL (kismet.travel repo, staging branch)
- Backend: Production backend API (deployed kismet-infrastructure repo)
- Database: Production database (ask user to verify data)
- Browser: Chrome DevTools (requires setup via `/chrome-debug` first)

**Production Backend Credentials:**
- API URL: `https://api.ksmt.app`
- API Key: `3a19136ab8255003cc6c982067c9815f4541d35225fdd028a48e3ef4cc1b591f`
- Tenant ID: `94ae6d2b-d7c8-4453-bee8-fc9143cb62b2`

**Key Differences from Local:**
- ❌ **NO Infra MCP tools** (those are dev database only)
- ✅ **Direct backend API access** (production endpoints)
- ✅ **Vercel logs available** (user can easily provide)
- ⚠️ **Ask user to check database** (no direct access)

---

## Before You Start

**Ask user for:**
1. **Vercel staging URL** - The specific deployment URL to debug (e.g., `https://kismet-travel-git-feature-branch.vercel.app`)
2. **What feature/page to debug** - Specific page or functionality with issues

**Production credentials are already configured above** - no need to ask user unless different.

**Setup Chrome:**
```bash
# Run this first to enable Chrome debugging
/chrome-debug
```

---

## Debugging Workflow (Execute in Order)

### Step 1: Database Layer - Ask User to Verify Data

**Goal:** Confirm data exists in production database before checking API/frontend.

**Important:** You cannot query the production database directly. Must ask user.

**Ask user:**
> "To debug this issue, I need to verify the data exists in the production database first. Can you check:
>
> 1. Does the record exist? (e.g., hotel ID, room ID, booking ID)
> 2. Are the required fields populated? (e.g., name, description, pricing)
> 3. Are relationships correct? (e.g., foreign keys, related records)
>
> Specifically, I need to verify: [be specific about what data/tables to check]"

**What user should verify:**
- ✅ Records exist for the feature being debugged
- ✅ Required fields are populated (not NULL or empty)
- ✅ Relationships are correct (foreign keys, joins)
- ✅ Data format matches expected schema

**If data is missing:** Stop here and ask user to create/fix data first.

---

### Step 2: API Layer - Verify Production Backend Returns Data

**Goal:** Test production backend API directly to confirm endpoints work.

**Tools:** Direct curl/fetch requests to production backend

**Actions:**

1. **Test backend API directly** (credentials configured at top of document):
```bash
# Production backend test (credentials configured above)
curl -H "X-API-Key: 3a19136ab8255003cc6c982067c9815f4541d35225fdd028a48e3ef4cc1b591f" \
  -H "X-Tenant-ID: 94ae6d2b-d7c8-4453-bee8-fc9143cb62b2" \
  https://api.ksmt.app/v1/[endpoint] | jq '.'
```

3. **Verify response:**
   - Check status code (200 OK)
   - Check response body has data (not empty objects)
   - Check data shape matches expected schema
   - Check all required fields are present

**Example endpoints to test:**
```bash
# Hotels endpoint
curl -H "X-API-Key: 3a19136ab8255003cc6c982067c9815f4541d35225fdd028a48e3ef4cc1b591f" \
  -H "X-Tenant-ID: 94ae6d2b-d7c8-4453-bee8-fc9143cb62b2" \
  https://api.ksmt.app/v1/hotels/<hotel-id>

# Storefronts endpoint
curl -H "X-API-Key: 3a19136ab8255003cc6c982067c9815f4541d35225fdd028a48e3ef4cc1b591f" \
  -H "X-Tenant-ID: 94ae6d2b-d7c8-4453-bee8-fc9143cb62b2" \
  https://api.ksmt.app/v1/storefronts/<id>/current
```

**What to verify:**
- ✅ API responds (not 404 or 500)
- ✅ Response data matches database data from Step 1
- ✅ Data structure is correct (not empty objects/arrays)
- ✅ All required fields present and populated

**If API returns wrong data:** Check Vercel backend logs or ask user for server logs.

---

### Step 3: Server Layer - Check Vercel Logs

**Goal:** Identify server-side errors in backend or frontend.

**Vercel logs are easily accessible to user** - they can provide frontend and backend logs quickly.

**Ask user for logs:**

> "To debug the server layer, I need to see Vercel logs. Can you provide:
>
> **Backend Logs (if backend is on Vercel):**
> - Any errors or exceptions from [endpoint] around [timestamp]
> - Request/response logs for [specific API call]
> - Any 500 errors or stack traces
>
> **Frontend Logs (Next.js on Vercel):**
> - Server-side rendering errors
> - API route errors (if using Next.js API routes)
> - Build or deployment errors
>
> Specifically, I'm looking for logs from [feature] when [action] was triggered."

**What to look for in logs:**
- ❌ Stack traces or exceptions
- ❌ API request failures (500, 404, timeouts)
- ❌ Database connection errors
- ❌ Validation failures
- ⚠️ Warnings that might indicate issues
- ℹ️ Request/response logs showing data flow

**Common issues:**
- CORS errors (frontend can't reach backend)
- Authentication errors (API key/tenant ID issues)
- Rate limiting or timeout errors
- Missing environment variables

---

### Step 4: Browser Layer - Check Frontend with Chrome DevTools

**Goal:** Verify Vercel staging frontend receives data and renders correctly.

**Tools:** Chrome DevTools via MCP

**Actions:**

1. **Navigate to Vercel staging URL:**
```typescript
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "https://kismet-travel-git-feature-branch.vercel.app/[page]"
})
```

2. **Take snapshot to see page state:**
```typescript
mcp__chrome-devtools__take_snapshot()
```

3. **Check network requests:**
```typescript
// List all network requests
mcp__chrome-devtools__list_network_requests()

// Inspect specific API call
mcp__chrome-devtools__get_network_request({ reqid: [id] })
```

**What to check in network logs:**
- ✅ API calls to production backend are being made
- ✅ Correct headers (X-API-Key, X-Tenant-ID)
- ✅ Response status is 200 OK
- ✅ Response body has data (not empty)
- ✅ No CORS errors

4. **Check console logs:**
```typescript
mcp__chrome-devtools__list_console_messages()
```

**What to check in console:**
- ❌ No JavaScript errors
- ❌ No React warnings
- ❌ No failed fetch calls
- ❌ No type errors
- ℹ️ Data is being logged (if using console.log)

5. **Take screenshot if visual issue:**
```typescript
mcp__chrome-devtools__take_screenshot()
```

**What to verify:**
- ✅ No console errors
- ✅ API data arrives from production backend
- ✅ Components render with correct props
- ✅ UI matches expected design
- ✅ No empty states when data should be present

---

## Common Staging Issues

### 1. CORS Errors
**Symptom:** Frontend can't fetch from backend, CORS error in console

**Check:**
- Backend CORS configuration allows Vercel domain
- Correct headers in API requests
- Backend URL is correct (https, not http)

### 2. Environment Variables
**Symptom:** API calls go to wrong URL or use wrong credentials

**Check:**
- Vercel environment variables are set correctly
- Environment variables deployed with staging branch
- No typos in env var names

### 3. Caching Issues
**Symptom:** Old data showing, changes not reflecting

**Check:**
- Vercel edge caching settings
- Browser cache (hard refresh with Cmd+Shift+R)
- API cache headers (`cache: 'no-store'`)

### 4. Build/Deployment Issues
**Symptom:** Code changes not deployed, old version running

**Check:**
- Latest commit deployed to Vercel
- Build succeeded (check Vercel dashboard)
- Correct branch deployed

---

## After Debugging: Document Findings

### 1. Create Beads Issue
```bash
bd add "Debug staging: [feature] [symptom]"
bd update [id] --comment "Environment: Vercel staging + production backend"
bd update [id] --comment "Root cause: [what you found]"
bd update [id] --comment "Solution: [what fixed it]"
```

### 2. Store Pattern in Graphiti
```typescript
mcp__graphiti-memory__add_memory({
  name: "Staging Debug: [Feature] [Symptom]",
  episode_body: `
    Environment: Vercel staging + production backend
    Symptom: [What was wrong]
    Layer: [database/api/server/browser]
    Root Cause: [Technical issue found]
    Solution: [How it was fixed]
    Files/Config Modified: [Paths, env vars, settings]
  `
})
```

### 3. Use `/beads-investigation` Command
For full structured documentation with timeline and learnings.

---

## Quick Reference

### Required Information from User

**Before starting, ask for:**
1. Vercel staging URL (e.g., `https://kismet-travel-git-branch.vercel.app`)
2. What feature/page to debug

**Production credentials already configured:**
- API URL: `https://api.ksmt.app`
- API Key: `3a19136ab8255003cc6c982067c9815f4541d35225fdd028a48e3ef4cc1b591f`
- Tenant ID: `94ae6d2b-d7c8-4453-bee8-fc9143cb62b2`

### Test Production API
```bash
# Production API template (credentials configured)
curl -H "X-API-Key: 3a19136ab8255003cc6c982067c9815f4541d35225fdd028a48e3ef4cc1b591f" \
  -H "X-Tenant-ID: 94ae6d2b-d7c8-4453-bee8-fc9143cb62b2" \
  https://api.ksmt.app/v1/[endpoint] | jq '.'
```

### Chrome Setup (Run First)
```bash
/chrome-debug
```

---

## Differences from Local Debugging

| Aspect | Local (`/debug-local`) | Staging (`/debug-staging`) |
|--------|------------------------|----------------------------|
| Frontend | localhost:3000 | Vercel URL |
| Backend | localhost:9091 | Production API |
| Database | Direct query (Infra MCP) | Ask user to check |
| Logs | Docker/npm logs | Vercel logs (ask user) |
| Mode | Auto or Manual | **MANUAL MODE ONLY** |
| Speed | Fast iteration | Slower (deployment required) |

---

## Integration with Other Commands

- **Before debugging:** Create Beads issue (`bd add "Debug staging: [feature]"`)
- **Chrome setup:** `/chrome-debug` (enables Chrome DevTools MCP)
- **After debugging:** `/beads-investigation` (structured documentation)
- **Related:** `/debug-local` for local environment debugging

---

## Debugging Philosophy

**Trace from source to destination (adapted for staging):**
1. Data exists? → Ask user to check production database
2. Data accessible? → Test production backend API directly
3. Data processed? → Check Vercel server logs
4. Data displayed? → Check Vercel frontend with Chrome

**Each layer builds on the previous:**
- No point checking API if data doesn't exist in database
- No point checking frontend if API isn't returning data
- Server logs reveal what's happening between database and browser

**Ask user when blocked:**
- Database queries: Always ask (no direct access)
- Server logs: Ask for Vercel logs (easy for user to provide)
- API credentials: Ask if not already provided
- Deployment status: Ask if unsure which version is deployed
