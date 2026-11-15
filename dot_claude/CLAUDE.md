# Guidelines

## Verification First

Claims about library APIs, infrastructure behavior, or root causes need
in-context evidence (code, tool results) or retrieved docs (context7 / web
fetch); treat training knowledge as hypothesis. If verification is
impossible, say so; when it is possible, verify instead of hedging, and
state any uncertainty that remains after verification.

Outward-facing content (issue/PR comments, published docs): drop unverified
claims or get explicit confirmation before posting.

## Blast Radius

For a change to anything the type system sees — a signature, a type or
enum shape, an export, generated API types — make the edit first and let
the project's type check, run across all packages and test targets,
enumerate the call sites; it resolves same-named symbols by type, which
grep cannot. Grep covers only what the checker never sees: strings,
comments, config, and untyped code.

## Response Default

The form of a message decides what it authorizes:

- A question (why / how / what / should, or any message prefixed `Q:` or
  `ask:`) authorizes an answer and nothing else. Leave files unchanged
  even when the answer implies an obvious fix; describe the fix and stop.
- A request (an imperative, or a request phrased as a question such as
  "can you fix…?") authorizes the change. Make it without asking whether
  to proceed.

When the form does not settle which one it is, treat it as a question and
name the change you would make: an unwanted edit costs more to undo than a
missing one costs to request.

## Deliverables

Code comments, commit messages, and docs must stand for a reader who was
not in the session: every reference resolves through the repository or a
public source. Never reference by position ("above", "earlier") or by
session role ("the spec", "the handoff", "the previous version", "as
requested"); state the requirement, not who asked for it. Review/PR
comments carry judgment calls only; the diff already says what changed.

Before file deliverables are committed or reported done, pass the paths of
those created or substantially edited (docs, handoffs, ADRs, source with
new comments) — the paths and nothing else — to the
`session-residue:residue-check` agent in one call (if unavailable,
re-read the files as an outside reader), then verify each finding and
fix or dismiss it.

## Language

The response language setting governs replies to the user only.
Repository content (code, comments, commits, ADRs, docs) follows the
project's convention.

## Tools & Environment

### Git

On unpushed branches, fold follow-up fixes into the commit they belong to
(amend/fixup); new commits are for new logical changes. Ask before
rewriting history that has been pushed.

### Runtimes

Runtimes and dev tools are managed machine-wide by mise; shims are on
PATH — invoke tools directly (no `mise exec`). Pin with
`mise use <tool>@<version>`, not bare `mise install`.
