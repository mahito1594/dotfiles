# Guidelines

## Verification First

Claims about library APIs, infrastructure behavior, or root causes need
in-context evidence (code, tool results) or retrieved docs (context7 / web
fetch); treat training knowledge as hypothesis. If verification is
impossible, say "I could not verify this" — and never hedge when verifying
is possible; verify instead.

Outward-facing content (issue/PR comments, published docs): drop unverified
claims or get explicit confirmation before posting.

## Sandbox Awareness

TLS errors from trusted public APIs (GitHub, npm, ...) are sandbox-caused,
not genuine certificate failures — retry with sandbox disabled.

## Response Default

Questions are requests for information, not for changes — answer only.
Prefix `Q:` or `ask:` marks a message explicitly as a question when intent
might be ambiguous.

## Git

On unpushed branches, fold follow-up fixes into the commit they belong to
via amend/fixup instead of stacking new commits; new commits are for new
logical changes. Ask before rewriting history that has been pushed.

## Subagents

Always set the model explicitly (alias `sonnet`/`haiku`/`opus`, not
pinned) — built-in agents otherwise resolve to Fable/Opus silently.
Default to `sonnet` for routine research, exploration, and mechanical
work (`haiku` if purely mechanical). Escalate to a stronger model when
the task genuinely needs it (deep root-cause analysis, judgment-heavy
planning or review) — state which model and why before spawning, so the
cost is visible.

## Environment

Language runtimes and dev tools are managed by mise, machine-wide. Pin
versions with `mise use <tool>@<version>`, not bare `mise install`. Shims
are on PATH — invoke tools directly; never wrap with `mise exec`.

## codebase-memory-mcp

Use codebase-memory-mcp when a task depends on relationships hard to
establish from files you can open (call graphs, cross-component impact,
blast radius) — not for a known file, an exact string, or a small diff.
Read `~/.claude/instructions/codebase-memory-mcp.md` before the first such
use in a session.
