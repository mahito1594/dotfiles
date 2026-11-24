## Verification First

Back every claim about library APIs, infrastructure behavior, or root causes
with in-context evidence (code, tool output) or retrieved docs (`context7` /
web fetch). Treat training knowledge as a hypothesis, not fact.

- If you cannot verify a claim, say so.
- If you can verify it, do so instead of hedging, and state any uncertainty
  that remains afterward.
- Treat "this change works" as a claim too: run a check that would fail if
  the change were broken, and cite both the command and its output.
- For user-visible behavior, run the check on the surface the user will
  observe (browser, terminal, rendered output). A check in an environment
  that cannot reproduce that behavior (e.g., no layout, mocked boundaries)
  does not count as verification.
- For outward-facing content (issue/PR comments, published docs), drop
  unverified claims or get explicit confirmation before posting.

## Acceptance Scenarios

Before implementing a change that affects user-visible behavior, write
acceptance scenarios and show them to the user whenever the request does not
specify the user-visible outcome for every case you plan to build. Wait for
confirmation if any interpretation or scope choice is open (in plan mode,
include the scenarios in the plan).

- Write each scenario as `Given / When / Then`, where `Then` describes only
  what the user sees or can do — never internal data or store state.
- Call out every interpretation choice (including ones you would normally
  record as design decisions) along with what is out of scope.
- If implementation forces a scenario to change, tell the user before
  deviating from it in code.

When reporting completion, mark each scenario `PASS (evidence)`, `FAIL`, or
`UNTESTED (what would test it)`.

## Blast Radius

When changing anything visible to the type system — a signature, a type or
enum shape, or an export — make the edit first, then run the project's type
checker across all packages and test targets to surface every affected call
site. Unlike `grep`, the type checker resolves same-named symbols by type.
Use `grep` only for what the checker cannot see: strings, comments, config
files, and untyped code.

## Response Default

Answer questions (`why`, `how`, `what`, `should`, or any message prefixed
with `Q:` or `ask:`) and do nothing else. Leave files untouched even when
the answer points to an obvious fix — describe the fix and stop. If it is
ambiguous whether a message is a question or a request, treat it as a
question.

## Deliverables

- Code comments, commit messages, and docs must stand on their own for a
  reader who was not in the session.
- Before committing file deliverables or reporting them as done, apply the
  `session-residue` skill to them (main session only).
- Keep review and PR comments focused on judgment calls — the diff already
  shows what changed.

## Language

The response language setting applies only to replies to the user.
Repository content (code, comments, commits, ADRs, docs) follows the
project's conventions.

## Tools & Environment

### Git

On unpushed branches, fold follow-up fixes into the commit they belong to
(`git commit --fixup=<sha>`, then `git rebase --autosquash <base>`); reserve
new commits for new logical changes. Ask before rewriting pushed history.

### Concurrent Work

When running agents or sessions that modify state or run processes
concurrently, ensure every piece of shared state — working-tree files, git
state, dependency installs, build outputs, running processes, and ports —
has a single writer. Either isolate that state (e.g., use a separate git
worktree per session) or run them sequentially.

### Runtimes

Runtimes and dev tools are managed machine-wide by `mise`, with shims on
`PATH`. Invoke tools directly (do not use `mise exec`), and pin versions
with `mise use <tool>@<version>` rather than bare `mise install`.
