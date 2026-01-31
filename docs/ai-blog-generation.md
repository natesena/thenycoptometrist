# AI Blog Generation System

> Reference: AI Blog Generation System Plan
> Status: Implemented
> Last Updated: 2026-01-31

## Overview

Automated blog post generation system that creates SEO-optimized, medically-accurate content for The NYC Optometrist. Posts are generated as drafts, emailed to Dr. Latek for review, and can be published with one click.

## User Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. TRIGGER                                                    │
│      └─ /generate-blog command or API call                      │
│                                                                 │
│   2. AI GENERATES                                               │
│      └─ z.ai creates blog post with citations (2021-2026 only)  │
│                                                                 │
│   3. DRAFT SAVED                                                │
│      └─ Post saved to Payload CMS as draft                      │
│                                                                 │
│   4. EMAIL SENT                                                 │
│      └─ Dr. Latek receives email with:                          │
│         • Full blog post preview (same styling as website)      │
│         • "Publish Now" button (one-click publish)              │
│         • "Edit in Admin" button (opens CMS)                    │
│                                                                 │
│   5. REVIEW & PUBLISH                                           │
│      └─ Dr. Latek either:                                       │
│         • Clicks "Publish Now" → Post goes live immediately     │
│         • Clicks "Edit in Admin" → Makes changes, then publishes│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Email Preview

The draft notification email shows the exact same content that will appear on the website:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [Featured Image]                                              │
│                                                                 │
│   Jan 31, 2026  •  Eye Care                                     │
│                                                                 │
│   Understanding Dry Eye Syndrome:                               │
│   Causes and Modern Treatments                                  │
│                                                                 │
│   Dry eye syndrome affects millions of Americans...             │
│                                                                 │
│   ## What Causes Dry Eyes?                                      │
│   ...article content with inline citations (Smith, 2023)...     │
│                                                                 │
│   ## Treatment Options                                          │
│   ...                                                           │
│                                                                 │
│   ## References                                                 │
│   1. Smith, J. "Dry Eye Treatments." J Ophthalmol, 2023.        │
│   2. NIH. "Dry Eye Disease." NEI, 2024.                         │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│   [Author Photo]  Dr. Joanna Latek                              │
│                   Eye Care Specialist                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   This draft was AI-generated. Review before publishing.        │
│                                                                 │
│   ┌─────────────────┐  ┌─────────────────┐                      │
│   │  Publish Now    │  │  Edit in Admin  │                      │
│   └─────────────────┘  └─────────────────┘                      │
│                                                                 │
│   Publish link expires in 7 days.                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## How to Generate a Blog Post

### Option 1: Claude Code Command

```bash
# Random topic from 9 categories
/generate-blog

# Specific category
/generate-blog dry eyes

# Specific topic
/generate-blog "blue light and screen time"
```

### Option 2: API Endpoint

```bash
# Generate with random topic
curl -X POST https://www.thenycoptometrist.com/api/blog/generate \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"sendEmail": true}'

# Generate with specific topic
curl -X POST https://www.thenycoptometrist.com/api/blog/generate \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"topic": "myopia management", "sendEmail": true}'
```

## Topic Categories

The system rotates through 9 eye care categories:

| Category | Example Topics |
|----------|----------------|
| Comprehensive Eye Exams | Annual exams, early detection, what to expect |
| Contact Lenses | Lens types, care, specialty lenses |
| Pediatrics | Children's eye health, first exams, school vision |
| Hot Topics | Screen time, blue light, trending topics |
| Dry Eyes | Symptoms, treatments, prevention |
| Eyeglasses & Vision Correction | Prescriptions, lens options, frames |
| Myopia Management | Childhood myopia, progression control |
| Disease | Glaucoma, macular degeneration, cataracts |
| Vision Therapy | Eye exercises, binocular vision issues |

## Content Guidelines

### Citation Requirements
- **Only peer-reviewed sources from 2021-2026** (last 5 years)
- Acceptable: NIH, CDC, AAO, AOA, PubMed, medical journals
- Minimum 3-5 citations per post
- MLA format without access dates

### Writing Style
- Professional yet approachable
- Educational and informative
- Explains medical terms when used
- Includes practical, actionable advice
- Ends with call-to-action to book with Dr. Latek

### SEO Optimization
- Title: 50-60 characters with primary keyword
- Meta description: 150-160 characters
- H2/H3 heading structure
- Primary keyword in first paragraph

## Architecture

### Files

| File | Purpose |
|------|---------|
| `lib/ai-provider.ts` | Provider-agnostic AI client (z.ai, OpenAI, Anthropic) |
| `lib/blog-generator.ts` | Core generation workflow |
| `lib/blog-topics.ts` | 9 topic categories with tags |
| `lib/blog-prompts.ts` | System/user prompts for content guidelines |
| `lib/blog-email-html.ts` | Pure HTML generator for email |
| `lib/email.ts` | Email sending via Resend |
| `app/api/blog/generate/route.ts` | POST endpoint for generation |
| `app/api/blog/publish/route.ts` | GET endpoint for one-click publish |
| `app/(frontend)/blog/[slug]/BlogPostContent.tsx` | Shared component for page & email |

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Trigger    │────▶│  AI Model    │────▶│  Payload CMS │
│  (API/CLI)   │     │   (z.ai)     │     │   (Draft)    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Website    │◀────│   Publish    │◀────│    Email     │
│  (Live Post) │     │   Endpoint   │     │  (Resend)    │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Security

### Publish Token
- 64-character random hex token generated per draft
- Stored in Payload CMS with the draft
- Required for one-click publish from email
- Cleared after successful publish (single-use)
- Expires after 7 days (enforced by convention)

### API Authentication
- `CRON_SECRET` or `BLOG_API_SECRET` required for generation endpoint
- Prevents unauthorized blog generation

## Environment Variables

```bash
# AI Provider (primary)
AI_PROVIDER=zai
Z_AI_API_KEY=xxx

# Fallback providers (optional)
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx

# Email notifications
RESEND_API_KEY=xxx
ANALYTICS_EMAIL_RECIPIENT=dr.latek@example.com
EMAIL_FROM=notifications@thenycoptometrist.com

# API security
CRON_SECRET=xxx
```

## Future Enhancements

- [ ] Automated cron job for weekly generation (`thenycoptometrist-eab`)
- [ ] Topic performance tracking via tags
- [ ] A/B testing of titles
- [ ] Image generation for featured images
- [ ] Instagram carousel auto-generation
