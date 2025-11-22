---
description: Run pre-push checks for kismet.travel and kismet-infrastructure repos
argument-hint: [kismet.travel|kismet-infrastructure|platform|all]
allowed-tools: Bash(npm:*, npx:*, git:*)
---

# Pre-Push Validation for Kismet Repositories

Run all required checks before pushing code. Specify repo name or "all" to check multiple repos.

Target repo: **$ARGUMENTS** (defaults to "all" if not specified)

## Your task:

Based on the target repo argument (or "all" if not provided), run the appropriate checks:

### For **kismet.travel**:
```bash
cd kismet.travel
echo "=== Running kismet.travel checks ==="
npm run type-check
npm run lint
npm run build
git status
git branch --show-current
cd ..
```

### For **kismet-infrastructure**:
```bash
cd kismet-infrastructure/api/hotels-api-ts
echo "=== Running kismet-infrastructure checks ==="
npm run build
npx prisma migrate status
cd ../..
git status
git branch --show-current
cd ..
```

### For **platform**:
```bash
cd platform/backend
echo "=== Running platform checks ==="
npm run build
npm run lint
npx prisma migrate status
cd ../..
git status
git branch --show-current
cd ..
```

## Instructions:

1. If argument is "kismet.travel", "kismet-infrastructure", or "platform" - run checks for that repo only
2. If argument is "all" or empty - run checks for all three repos
3. Stop on first failure and report details
4. For each repo, report:
   - ✅ Checks that passed
   - ❌ Checks that failed (with error details)
   - Migration status (if applicable)
   - Current branch name
   - Any uncommitted changes

5. At the end, provide a summary of which repos are ready to push
