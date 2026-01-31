---
description: Generate an AI-powered blog post draft for The NYC Optometrist
allowed-tools: Bash, Read, Task
---

# Generate Blog Post

## Usage

```
/generate-blog                    # Generate with random topic
/generate-blog dry eyes           # Generate about specific topic
/generate-blog "myopia in kids"   # Generate with specific subtopic
```

## What This Does

Generates an AI-powered blog post draft:
1. Selects or accepts a topic category
2. Generates content via AI (z.ai or configured provider)
3. Saves as draft in Payload CMS
4. Sends email notification with publish button
5. Reports summary with admin link and Instagram content

## Instructions

Execute the blog generation workflow following these steps:

### Step 1: Parse Topic Argument

Check if the user provided a topic argument: **$ARGUMENTS**

- If empty/blank: Will use a random topic category
- If provided: Will search for matching topic category or use as specific topic

### Step 2: Call the Blog Generation API

Make a POST request to the blog generation endpoint:

```bash
curl -X POST http://localhost:3333/api/blog/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"topic": "<topic-from-arguments-or-empty>", "sendEmail": true}'
```

**Note:** If no CRON_SECRET is configured, the API will allow the request (for local dev).

### Step 3: Report Results

After the API returns, provide a summary:

**If successful:**
```
## Blog Draft Generated

**Title:** [generated title]
**Category:** [topic category]
**Tags:** [list of tags]

**Admin URL:** [link to edit in Payload CMS]

---

### Instagram Content Ready

**Caption:**
[instagram caption]

**Carousel Slides:**
1. [slide 1]
2. [slide 2]
...

---

### Featured Image Suggestion
[image suggestion]

---

Dr. Latek has been emailed with a preview and one-click publish button.
```

**If failed:**
```
Blog generation failed: [error message]

Please check:
1. AI_PROVIDER and API key are configured
2. The dev server is running (npm run dev)
3. Payload CMS is accessible
```

## Available Topic Categories

When providing a topic, you can use any of these categories or a specific subtopic:

1. **Comprehensive Eye Exams** - Annual exams, early detection, what to expect
2. **Contact Lenses** - Lens types, care, specialty lenses
3. **Pediatrics** - Children's eye health, first exams, school vision
4. **Hot Topics** - Trending eye health topics, lifestyle
5. **Dry Eyes** - Symptoms, treatments, prevention
6. **Eyeglasses & Vision Correction** - Prescriptions, lens options, frames
7. **Myopia Management** - Childhood myopia, progression control
8. **Disease** - Glaucoma, macular degeneration, cataracts
9. **Vision Therapy** - Eye exercises, binocular vision issues

## Environment Variables Required

For blog generation to work, these must be configured:

```bash
# AI Provider (choose one)
AI_PROVIDER=zai         # or openai, anthropic, openrouter
Z_AI_API_KEY=xxx        # if using z.ai
OPENAI_API_KEY=xxx      # if using openai
ANTHROPIC_API_KEY=xxx   # if using anthropic

# Email (for notifications)
RESEND_API_KEY=xxx
ANALYTICS_EMAIL_RECIPIENT=xxx
ANALYTICS_EMAIL_FROM=xxx
```

## Example Outputs

**Random topic generation:**
```
/generate-blog
→ Generates: "Understanding Dry Eye Syndrome: Causes and Modern Treatments"
→ Category: Dry Eyes
→ Tags: dry-eyes, treatments, prevention
```

**Specific topic:**
```
/generate-blog myopia
→ Generates: "Why Is My Child's Myopia Getting Worse? A Guide for NYC Parents"
→ Category: Myopia Management
→ Tags: myopia, children, progression-control
```

## Technical Reference

- AI provider setup: `lib/ai-provider.ts`
- Topic categories: `lib/blog-topics.ts`
- Prompt templates: `lib/blog-prompts.ts`
- Core generator: `lib/blog-generator.ts`
- Payload API: `lib/payload-api.ts`
- Email notifications: `lib/email.ts`
- API endpoint: `app/api/blog/generate/route.ts`
- Publish endpoint: `app/api/blog/publish/route.ts`

Reference: AI Blog Generation System Plan
