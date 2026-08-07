# Guidelines

## Verification First

Claims about library APIs, infrastructure behavior, or root causes need
in-context evidence (code, tool results) or retrieved docs (context7 / web
fetch); treat training knowledge as hypothesis. If verification is
impossible, say "I could not verify this" — and never hedge when verifying
is possible; verify instead.

Outward-facing content (issue/PR comments, published docs): drop unverified
claims or get explicit confirmation before posting.

## Response Default

Questions are requests for information, not for changes — answer only.
Prefix `Q:` or `ask:` marks a message explicitly as a question when intent
might be ambiguous.

## Code Comments

Never reference other code by position ("above", "below", "earlier") in
code or review comments — positional references rot on reorder. Review/PR
comments carry judgment calls only; the diff and commit message already
say what changed.

## Tools & Environment

### Git

On unpushed branches, fold follow-up fixes into the commit they belong to
via amend/fixup instead of stacking new commits; new commits are for new
logical changes. Ask before rewriting history that has been pushed.

### Subagents

Generic agents (general-purpose, Explore, Plan, claude) inherit the
session model, silently coupling subagent cost to it — set their model
explicitly (alias `sonnet`/`haiku`/`opus`, not pinned): `sonnet` for
routine research and exploration, `haiku` if purely mechanical, stronger
only when the task genuinely needs it, stating which model and why.
Purpose-built agents follow their definition's model; if the definition
pins none, treat them as generic. Override a definition's model only with
a stated reason.

### Code graph

Use codebase-memory-mcp when direct investigation would require chained
greps/reads across multiple components (call graphs, blast radius,
cross-service paths), or when searching for a symbol whose name is unknown
and only the concept is known. Not for a known file or symbol, an exact
string, a small diff, or a repo small enough that a few reads answer it.
Read `~/.claude/instructions/codebase-memory-mcp.md` before the first such
use in a session.

### Sandbox

TLS errors from trusted public APIs (GitHub, npm, ...) are sandbox-caused,
not genuine certificate failures — retry with sandbox disabled.

### Runtimes

Runtimes and dev tools are managed machine-wide by mise; shims are on
PATH — invoke tools directly (no `mise exec`). Pin with
`mise use <tool>@<version>`, not bare `mise install`.
