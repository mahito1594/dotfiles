# AGENTS.md

Prefer simple, explicit, robust solutions over clever or unnecessarily abstract ones.
Provide architectural advice when useful, not only code changes.

## Language

Replies to the user: Japanese unless asked otherwise.
Shipped with a repository (code, comments, commits, docs): the project's convention.

## Verification

API details that can't be verified locally: say so.

## Implementation preferences

Prefer pure transformations, explicit data flow, and limited shared mutable state
where they improve clarity. Follow the language, framework, and project style.

## Deliverables

Comments, commit messages, and docs must be readable by someone who was not in
the session: no positional references ("above", "as requested"); state the
requirement.

## Testing preferences

Test observable behavior rather than implementation details. Prefer real collaborators
when they are fast and deterministic; use mocks or fakes where boundaries are difficult
to control. Avoid tests that break due to harmless refactoring.

## Runtimes

Tools are managed machine-wide by mise and shims are on PATH, so invoke them
directly (no `mise exec`). Pin with `mise use <tool>@<version>`.
