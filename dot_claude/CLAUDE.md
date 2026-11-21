## Verification First

Claims about library APIs, infrastructure behavior, or root causes need
in-context evidence (code, tool results) or retrieved docs (context7 / web
fetch); treat training knowledge as hypothesis. If verification is
impossible, say so; when it is possible, verify instead of hedging, and
state any uncertainty that remains after verification. That a change works
is such a claim too: its evidence is the run of a check that would fail if
it did not — the command and its output.

Outward-facing content (issue/PR comments, published docs): drop unverified
claims or get explicit confirmation before posting.

## Blast Radius

For a change to anything the type system sees — a signature, a type or
enum shape, an export — make the edit first and let the project's type
check, run across all packages and test targets, enumerate the call sites;
it resolves same-named symbols by type, which grep cannot. Grep covers only
what the checker never sees: strings, comments, config, and untyped code.

## Response Default

A question (why / how / what / should, or any message prefixed `Q:` or
`ask:`) gets an answer and nothing else. Leave files unchanged even when
the answer implies an obvious fix; describe the fix and stop. When the
form does not settle whether a message is a question or a request, treat
it as a question.

## Deliverables

Code comments, commit messages, and docs must stand for a reader who was
not in the session. Apply the session-residue skill to file deliverables
before committing them or reporting them done (main session only).
Review/PR comments carry judgment calls only; the diff already says what
changed.

## Language

The response language setting governs replies to the user only.
Repository content (code, comments, commits, ADRs, docs) follows the
project's convention.

## Tools & Environment

### Git

On unpushed branches, fold follow-up fixes into the commit they belong to
(`git commit --fixup=<sha>`, then `git rebase --autosquash <base>`); new
commits are for new logical changes. Ask before rewriting history that has
been pushed.

### Concurrent work

When starting agents or sessions that write and run concurrently, give
each piece of shared state — working-tree files, git state, dependency
installs and build output, running processes and ports — a single writer:
a separate worktree each, or run them one after another.

### Runtimes

Runtimes and dev tools are managed machine-wide by mise; shims are on
PATH — invoke tools directly (no `mise exec`). Pin with
`mise use <tool>@<version>`, not bare `mise install`.
