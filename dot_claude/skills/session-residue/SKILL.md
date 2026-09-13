---
name: session-residue
description: Apply before drafting a commit message, a PR description, or a doc (new or substantially edited), then re-apply its test to the finished text. At commit, the diff's code comments are in scope too. Removes session residue - sentences a reader outside this session cannot resolve.
user-invocable: false
---

# Session residue

Test every sentence: can a reader who was not in this session — no
transcript, no plan file, nothing under `.claude/**` — resolve it through
the repository or a public source? If not, rewrite or delete.

Apply this as a prior while drafting and as a test when finishing. The
final check reads the resulting file (at least the edited section) top to
bottom, not the diff: the diff is the writer's view and makes history
sentences look natural; the file is the reader's view, where they float.

## Residue

Session-relative references:

- roles: "the spec", "the brief", "the handoff", "the plan"
- history: "unlike the previous version", "this was changed to", "the
  earlier attempt"
- conversation: "as requested", "the user wanted", "per discussion",
  "the prompt says"
- rationale by negation: "this section exists because", "to satisfy the
  requirement", "we do not use X"

A sentence about a change must name what it changed from by an
identifier the repository or a public source resolves: a commit hash with
its subject line, an ADR number, a version. If it cannot, either restate
it as the present state, or move the history to its home: the
repository's history container when it has one (`docs/adr/`,
`CHANGELOG.md`), otherwise the commit message.

- Poor: "This was changed to fetch one page at a time."
- Better: "Fetches one page at a time (ADR-0004)." — or drop the
  history and let the commit message carry it.

Constraints live in the design, not in a disclaimer:

- Poor: "This tool does not use a database."
- Better: describe what it does use; the absence is visible from the code.

Examples given to convey intent do not become content unless the
artifact needs them. A project-specific case does not belong in a
general-purpose document unless it is the subject.

## Per deliverable

Code comments — cite by repository path or public URL, never by session
role; if the source is neither in the repository nor public, do not cite
it. Comments explain what the code cannot, nothing about how the change
came to be.

- Poor: `// per the handoff, retries are capped at 3`
- Better: `// upstream rate-limits after 3 rapid retries`

Commit messages — intent/decision lines keep the why; drop attribution
to the conversation.

- Poor: `intent(model-policy): the user wants the implementer model choosable per unit`
- Better: `intent(model-policy): the implementer model must be choosable per unit`

Docs (e.g., README, ADR, SKILL.md) — the reader arrives cold. No "this
version", no comparison with drafts that never shipped. ADR alternatives
are options considered, not attempts made in a session.

## Audit pass

When asked to remove residue from a diff or document: apply the test, fix
in place, report the files touched — not each sentence removed. No preface
about what was cleaned.
