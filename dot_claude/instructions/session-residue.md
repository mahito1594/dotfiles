# Session residue

Test every sentence: can a reader who was not in this session — no
transcript, no plan file, nothing under `.claude/**` — resolve it through
the repository or a public source? If not, rewrite or delete.

## Residue

Session-relative references:

- roles: "the spec", "the brief", "the handoff", "the plan"
- history: "unlike the previous version", "this was changed to", "the
  earlier attempt"
- conversation: "as requested", "the user wanted", "per discussion",
  "the prompt says"
- rationale by negation: "this section exists because", "to satisfy the
  requirement", "we do not use X"

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
