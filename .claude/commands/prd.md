---
description: Create a Product Requirements Document (PRD) as a bd issue
---

You are tasked with helping create a comprehensive Product Requirements Document (PRD) using the bd (beads) issue tracker.

Follow these steps:

1. **Gather Information**: Ask the user for the following PRD details if not already provided:
   - Feature/Product Title (required)
   - Problem Statement: What problem does this solve?
   - Goals & Objectives: What are we trying to achieve?
   - User Stories: Who is this for and what do they need?
   - Requirements: What are the functional and non-functional requirements?
   - Acceptance Criteria: How do we know when it's done?
   - Design Considerations: Any UI/UX or technical design notes?
   - Dependencies: Any other issues this depends on or blocks?
   - Priority: 0-4 (0=highest, 2=default)
   - Type: Should this be a 'feature' or 'epic'?

2. **Structure the PRD**: Format the information into a well-structured description following this template:

```
## Problem Statement
[What problem are we solving?]

## Goals & Objectives
[What are we trying to achieve?]

## User Stories
[Who is this for and what do they need?]

## Requirements
### Functional Requirements
- [Requirement 1]
- [Requirement 2]

### Non-Functional Requirements
- [Performance, security, scalability, etc.]

## Design Considerations
[UI/UX notes, technical architecture, etc.]
```

3. **Create the bd Issue**: Use the bd create command with the following structure:
   ```
   bd create "TITLE" \
     -t TYPE \
     -p PRIORITY \
     -d "DESCRIPTION" \
     --acceptance "ACCEPTANCE_CRITERIA" \
     --design "DESIGN_NOTES" \
     --deps "DEPENDENCIES" \
     --json
   ```

4. **Confirm Creation**: After creating the issue, confirm with the user and show them:
   - The issue ID that was created
   - How to view it: `bd show ISSUE_ID`
   - How to update it later: `bd update ISSUE_ID`

IMPORTANT: Be thorough and ask clarifying questions to create a complete PRD. Don't make assumptions about requirements or acceptance criteria.
