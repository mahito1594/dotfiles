# Codebase memory guidance

Use `codebase-memory-mcp` when the task depends on relationships or structure that
are difficult to establish from an isolated file.

Typical uses include:

* understanding architecture and subsystem boundaries;
* locating symbols when the name is unknown and only the concept is known
  (`search_graph` with `semantic_query`); when a name or exact string is
  known, grep instead;
* tracing callers, callees, dependencies, and execution paths;
* cross-component impact: multi-component bugs, changes reviewed for overlooked
  dependencies, refactoring blast radius (`detect_changes`; `since: "HEAD"` also
  covers uncommitted work);
* identifying relevant tests and related code before or after a change (path
  tracing filters out tests unless `include_tests` is set).

Use the graph to narrow the investigation, not to replace source verification:
treat empty, ambiguous, stale, or contradictory graph results as a reason to
inspect the source with file reads, text search, or tests.

Graph silence is not evidence: before a negative or exhaustive claim
(absence, dead code, a complete caller or impact list), check the relevant
paths or scopes with `check_index_coverage`. A clean result means no
recorded gaps, not completeness; partial or skipped coverage means falling
back to source and text search.

Prefer direct tools when the question is inherently local or textual, such as:

* reading a known file or symbol;
* finding an exact string, configuration key, or error message;
* inspecting a small diff;
* checking runtime behavior.

The graph also misses generated, reflective, dynamic, and configuration-driven
relationships — use source and text search for those regardless of scale.

Out-of-scope tools: do not use `manage_adr` in projects whose ADRs live as
files in the repository — the repo files are the source of truth. Use
`ingest_traces` only when the user explicitly provides runtime trace data
and asks for it.

Before the first graph query in a session (not at session start), run
`index_repository` once. An already-indexed repo re-indexes incrementally in
~0.2s; a never-indexed repo triggers a full build — tell the user before
starting one. Graph queries take the derived `project` name (`list_projects`
if a call reports an unknown project). For freshness, do not rely on
auto-watch or `index_status` — coverage reporting is their valid use.
