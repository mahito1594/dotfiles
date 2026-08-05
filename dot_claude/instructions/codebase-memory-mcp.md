# Codebase memory guidance

Use `codebase-memory-mcp` when the task depends on relationships or structure that
are difficult to establish from an isolated file.

Typical uses include:

* understanding architecture and subsystem boundaries;
* locating relevant symbols and implementations;
* tracing callers, callees, dependencies, and execution paths;
* cross-component impact: multi-component bugs, changes reviewed for overlooked
  dependencies, refactoring blast radius (`detect_changes`; `since: "HEAD"` also
  covers uncommitted work);
* identifying relevant tests and related code before or after a change (path
  tracing filters out tests unless `include_tests` is set).

Use the graph to narrow the investigation, not to replace source verification:
treat empty, ambiguous, stale, or contradictory graph results as a reason to
inspect the source with file reads, text search, or tests.

Prefer direct tools when the question is inherently local or textual, such as:

* reading a known file or symbol;
* finding an exact string, configuration key, or error message;
* inspecting a small diff;
* checking runtime behavior.

The graph also misses generated, reflective, dynamic, and configuration-driven
relationships — use source and text search for those regardless of scale.

Before the first graph query in a session (not at session start), run
`index_repository` once. An already-indexed repo re-indexes incrementally in
~0.2s; a never-indexed repo triggers a full build — tell the user before
starting one. Graph queries take the derived `project` name (`list_projects`
if a call reports an unknown project). Do not rely on `index_status` or
auto-watch for freshness.
