---
description: Upload a document to Archon RAG knowledge base
argument-hint: <file-path>
allowed-tools: Read, Bash(curl:*), Bash(sleep:*)
---

# Upload Document to Archon RAG Knowledge Base

Upload a document to Archon's RAG knowledge base for semantic search and retrieval.

**File to upload:** `$ARGUMENTS`

**Supported formats:** PDF, Word (.docx/.doc), HTML, Markdown, Text files (.txt, .md, .rst)

## Your Task:

### Step 1: Validate Input
1. Check that the user provided a file path as an argument
2. If no argument provided, show usage: `/archon-upload <file-path>`
3. Verify the file exists

### Step 2: Set Configuration
Use these settings:
- **API URL:** `http://100.74.174.10:8181`
- **Knowledge Type:** `documentation`
- **Extract Code Examples:** `true`

### Step 3: Determine Document Metadata
Based on the file path and content, determine:

**Title:** Extract from filename (e.g., `CLAUDE.md` → "CLAUDE")

**Description:** Auto-generate based on file location:
- If in `docs/` → "Documentation from {filename}"
- If in `.claude/` → "Claude configuration: {filename}"
- If in root → "Project file: {filename}"

### Step 4: Upload to Archon
Use curl to upload the file with metadata:

```bash
curl -s -X POST "http://100.74.174.10:8181/api/documents/upload" \
  -F "file=@{file_path}" \
  -F "title={title}" \
  -F "description={description}" \
  -F "knowledge_type=documentation"
```

**Important:** The file path must be relative to the current working directory (Kismet folder).

### Step 5: Report Upload Started
Parse the initial upload response and report to the user:

**On Success:**
```
✅ Document upload started!

File: {filename}
Title: {title}
Progress ID: {progressId}

The document will be processed and indexed in the background.
It will be searchable via rag_search_knowledge_base() once processing completes.
```

**On Error:**
```
❌ Upload failed: {error_message}

Please check:
- File path is correct and file exists
- Archon API is running at http://100.74.174.10:8181
- File format is supported (PDF, Word, HTML, Markdown, Text)
```

### Monitoring Upload Progress (Not Recommended)

**Note:** Monitoring upload progress is usually unnecessary as uploads complete quickly. However, if needed, you can check manually:

```bash
curl -s "http://100.74.174.10:8181/api/crawl-progress/{progressId}"
```

The upload is asynchronous and typically completes within a few seconds for most documents.

## Examples:

```
/archon-upload CLAUDE.md
/archon-upload docs/AI_STOREFRONT_IMPLEMENTATION_PLAN.md
/archon-upload kismet-infrastructure/docs/PROJECT_STATUS.md
/archon-upload path/to/document.pdf
/archon-upload path/to/report.docx
```

## Available Endpoints:

- Upload: `POST http://100.74.174.10:8181/api/documents/upload`
- Progress: `GET http://100.74.174.10:8181/api/crawl-progress/{progressId}`
- Health: `GET http://100.74.174.10:8181/api/health`
- API Docs: `http://100.74.174.10:8181/docs`

## Notes:

- The file will be indexed and immediately searchable via `rag_search_knowledge_base()` MCP tool
- The upload is asynchronous - progress is automatically monitored
- Use the source ID to filter searches to this specific document
