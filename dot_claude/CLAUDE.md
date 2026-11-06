# Guidelines

## Verification First

Claims about library APIs, infrastructure behavior, or root causes need
in-context evidence (code, tool results) or retrieved docs (context7 / web
fetch); treat training knowledge as hypothesis. If verification is
impossible, say so; when it is possible, verify — never hedge.

Outward-facing content (issue/PR comments, published docs): drop unverified
claims or get explicit confirmation before posting.

## Blast radius

For a change to anything the type system sees — a signature, a type or
enum shape, an export, generated API types — make the edit first and let
the project's type check, run across all packages and test targets,
enumerate the call sites; it resolves same-named symbols by type, which
grep cannot. Grep covers only what the checker never sees: strings,
comments, config, and untyped code.

## Response Default

Questions are requests for information, not for changes — answer only.
Prefix `Q:` or `ask:` marks a message as a question when intent is
ambiguous.

## Deliverables

Code comments, commit messages, and docs must stand for a reader who was
not in the session: every reference resolves through the repository or a
public source. Never reference by position ("above", "earlier") or by
session role ("the spec", "the handoff", "the previous version", "as
requested"); state the requirement, not who asked for it. Review/PR
comments carry judgment calls only; the diff already says what changed.

After creating or substantially editing a file deliverable (doc, handoff,
ADR, source with new comments), pass its path — nothing else — to the
`session-residue:residue-check` agent (if unavailable, re-read the file
as an outside reader), then verify each finding and fix or dismiss it.

## Language

Repository content (code, comments, commits, ADRs, docs) follows the
project's convention, regardless of the response language setting.

## Tools & Environment

### Sandbox

A sandbox-exempt command stays exempt only as the whole call: anything
joined to it (a pipe, `&&`, `cd`, even inside quotes) or placed before
its subcommand (`git -C`) sandboxes the entire call, including the
processes it spawns.

On "Operation not permitted" or a credential, host-key, proxy, TLS, or
DNS error, rerun the failing command alone (`cd` in its own call first)
— the intended route out of the sandbox, not a workaround. If that is
impossible or still fails, quote the error and give the user
`! <command>`.

### Git

On unpushed branches, fold follow-up fixes into the commit they belong to
(amend/fixup); new commits are for new logical changes. Ask before rewriting history that has been pushed.

### Subagents

Generic agents (general-purpose, Explore, Plan, claude) inherit the
session model, silently coupling subagent cost to it — set their model
explicitly (alias `sonnet`/`haiku`/`opus`, not pinned): `sonnet` for
routine research and exploration, `haiku` if purely mechanical, stronger
only when the task genuinely needs it, stating which model and why.
Purpose-built agents follow their definition's model; if the definition
pins none, treat them as generic. Override a definition's model only with
a stated reason.

### Runtimes

Runtimes and dev tools are managed machine-wide by mise; shims are on
PATH — invoke tools directly (no `mise exec`). Pin with
`mise use <tool>@<version>`, not bare `mise install`.
