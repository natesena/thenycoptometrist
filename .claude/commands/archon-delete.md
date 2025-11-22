---
description: Delete a document from Archon RAG knowledge base
argument-hint: <source-id>
allowed-tools: Bash(curl:*)
---

# Delete Document from Archon RAG Knowledge Base

Delete a document from Archon's RAG knowledge base by its source ID.

**Source ID to delete:** `$ARGUMENTS`

## Your Task:

### Step 1: Validate Input
1. Check that the user provided a source ID as an argument
2. If no argument provided, show usage: `/archon-delete <source-id>`

**Note:** To find a document's source ID, you can:
- Use `rag_get_available_sources()` MCP tool to list all sources
- Check the upload response when you originally uploaded the file
- The source ID is typically in format: `file_<filename>_<uuid>`

### Step 2: Delete from Archon
Use curl to delete the document from the Archon API:

```bash
curl -X DELETE "http://100.74.174.10:8181/api/knowledge-items/{source_id}"
```

### Step 3: Report Results
Parse the JSON response and report to the user:

**On Success:**
```
✅ Document deleted successfully!

Source ID: {source_id}

The document and all its associated data (chunks, embeddings, code examples) have been removed from the knowledge base.
```

**On Error:**
```
❌ Deletion failed: {error_message}

Please check:
- Source ID is correct
- Archon API is running at http://100.74.174.10:8181
- The document exists in the knowledge base
```

## Examples:

```
/archon-delete file_README_md_a1b2c3d4
/archon-delete 50a58b4f655899e0
```

## Notes:

- Deletion is permanent and cannot be undone
- All associated chunks, embeddings, and code examples are also deleted
- The document will no longer appear in RAG search results
