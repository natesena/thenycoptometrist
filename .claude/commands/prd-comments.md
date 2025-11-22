---
description: Add PRD-driven comments to code that explain design decisions
argument-hint: <prd-file-path>
allowed-tools: Read, Glob, Grep, Edit
---

# Add PRD-Driven Comments to Code

Review code related to a PRD feature and add comments explaining design decisions, technical choices, and context for future maintainers.

**PRD to analyze:** `$ARGUMENTS`

## Your Task:

### Step 1: Validate Input
1. Check that the user provided a PRD file path as an argument
2. If no argument provided, show usage: `/prd-comments <path-to-prd-readme>`
3. Verify the PRD file exists and is readable

**Example:**
```
/prd-comments .claude/tasks/hotel-faq-schema/hotel-faq-schema-README.md
```

### Step 2: Analyze the PRD

Read the PRD file and extract:

1. **Key Design Decisions** - Look in CHANGELOG section for:
   - What changed from original plan
   - Why it changed
   - What was replaced
   - Supporting evidence (file paths, docs, user feedback)

2. **Critical Technical Choices** - Look for:
   - Schema design decisions
   - API endpoint patterns
   - URL routing choices
   - Data modeling rationale
   - Integration patterns
   - UX workflow decisions

3. **Non-Obvious Context** - Note anything that:
   - Required research or investigation
   - Has compliance requirements (Google, Schema.org)
   - Deviates from standard patterns
   - Solves specific business problems
   - Has future implications

### Step 3: Identify Code Files

Search for code files related to the feature:

1. **Backend Code:**
   - Prisma schema models
   - Service classes
   - Controllers
   - API routes
   - JSON-LD generation

2. **Frontend Code:**
   - Page components
   - Client components
   - API routes/proxies
   - UI components

3. **Focus on NEW code:**
   - Use `git diff origin/main..HEAD` to find changed files
   - OR use Glob/Grep to find files mentioned in PRD
   - Prioritize files with significant changes

### Step 4: Review Each File for Comment Opportunities

For each code file, look for places that need comments explaining:

**✅ GOOD Comment Opportunities (WHY, not WHAT):**
- Design decisions documented in PRD
- Schema constraints with business rationale
- Separate script blocks or unconventional patterns
- Compliance requirements (Google, Schema.org)
- Performance optimizations
- Security considerations
- Integration patterns
- URL routing decisions
- Cache strategies

**❌ AVOID Commenting:**
- Obvious code (what it does is clear from reading)
- Self-documenting function names
- Simple variable assignments
- Standard patterns (unless PRD explains deviation)

### Step 5: Add Comments with PRD Context

Format comments to include:

1. **Decision Context:**
   ```typescript
   /**
    * DESIGN DECISION: FAQ and Hotel schemas as SEPARATE script blocks
    *
    * WHY SEPARATE:
    * - Schema.org: Hotel type lacks `hasPart` property (cannot nest FAQPage)
    * - Google compliance: FAQ content displayed in AI mode toggle
    * - Valid pattern: Multiple independent script blocks per page
    *
    * See PRD CHANGELOG (2025-10-20) for full research documentation
    */
   ```

2. **Schema Constraints:**
   ```typescript
   // REQUIRED: Every answer MUST have a question (enforced by schema)
   // See PRD: "Enforce required questionId for all answers"
   // Migration cleaned up 2 orphaned answers before adding constraint
   questionId String  @map("question_id") @db.Uuid
   ```

3. **Integration Patterns:**
   ```typescript
   // Use absolute URL for server-side fetch
   // Next.js server components require absolute URLs, not relative paths
   // See PRD Component 10 implementation notes
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
   ```

4. **Compliance Requirements:**
   ```typescript
   /**
    * GOOGLE COMPLIANCE: FAQ content visible in AI mode (acts as "expandable section")
    * This satisfies Google's requirement that FAQ content be accessible where schema exists
    *
    * Reference: https://developers.google.com/search/docs/appearance/structured-data/faqpage
    * PRD Section: "Hotel Page - AI Mode" design diagram
    */
   ```

### Step 6: Report Results

After adding comments, provide summary:

```
✅ Added PRD-driven comments to [N] files:

**Backend (kismet-infrastructure):**
- prisma/schema.prisma: Added constraint rationale for questionId
- src/services/jsonld.service.ts: Explained FAQ filtering logic

**Frontend (kismet.travel):**
- app/h/[slug]/page.tsx: Documented separate script block decision
- app/h/[slug]/hotel-mode-client.tsx: Explained AI mode FAQ display

**Key Context Preserved:**
- Design decision: Separate FAQ and Hotel JSON-LD script blocks
- Schema constraint: Answer must have question (migration context)
- Compliance: Google FAQ visibility requirements
- Integration: Server-side fetch absolute URL requirement

All comments reference PRD sections for full context.
```

## Best Practices:

1. **Explain WHY, not WHAT**
   - BAD: `// Filter questions` (obvious from code)
   - GOOD: `// Only published questions with accepted answers for schema.org compliance`

2. **Reference PRD sections**
   - Link to specific CHANGELOG entries
   - Mention component numbers
   - Reference design diagrams

3. **Include evidence**
   - File paths from PRD
   - External docs (Schema.org, Google)
   - Migration history
   - User feedback

4. **Think future maintainer**
   - What would confuse someone in 6 months?
   - What decisions aren't obvious from code?
   - What research/investigation led to this approach?

5. **Keep comments concise**
   - Brief explanation in code
   - Reference PRD for full details
   - Don't duplicate PRD content

## Examples:

### Example 1: Schema Constraint
```typescript
// BEFORE:
questionId String  @map("question_id") @db.Uuid

// AFTER:
// REQUIRED: Every answer MUST have a question (enforced by schema)
// Migration 20251021152004 cleaned up 2 orphaned answers before adding constraint
// See PRD CHANGELOG: "Enforce required questionId for all answers"
questionId String  @map("question_id") @db.Uuid
```

### Example 2: Separate Script Blocks
```typescript
// BEFORE:
<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLD)}} />

// AFTER:
{/*
  CRITICAL: Hotel and FAQ schemas as SEPARATE script blocks

  WHY SEPARATE:
  - Schema.org: Hotel type lacks `hasPart` property (cannot nest FAQPage)
  - Google compliance: FAQ content displayed in AI mode toggle
  - Valid pattern: Multiple independent script blocks per page

  See PRD CHANGELOG (2025-10-20) for full research documentation
*/}
<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLD)}} />
```

### Example 3: Business Logic
```typescript
// BEFORE:
const questionsWithAnswers = faqPage.questions.filter(q => q.acceptedAnswer !== null)

// AFTER:
// Schema.org FAQPage requires Question with acceptedAnswer
// Filter out questions without answers (drafts, unanswered)
// Only published content appears in JSON-LD for AI agent consumption
const questionsWithAnswers = faqPage.questions.filter(q => q.acceptedAnswer !== null)
```

## Notes:

- Focus on code that implements PRD design decisions
- Comments should survive code reviews (provide value)
- Reference PRD for deep dives, keep code comments brief
- Update comments if implementation changes
- Good comments reduce time-to-understanding for new developers
