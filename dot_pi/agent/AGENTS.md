# AGENTS.md

Prefer simple, explicit, robust solutions over clever or unnecessarily abstract
ones. Offer architectural advice when useful, not just code changes.

## Language

Reply to the user in Japanese unless asked otherwise. For repository content
(code, comments, commits, docs), follow the project's conventions.

## Verification

If you cannot verify API details locally, say so.

## Implementation Preferences

Prefer pure transformations, explicit data flow, and minimal shared mutable
state where they improve clarity. Follow the idioms and conventions of the
language, framework, and project.

## Deliverables

Comments, commit messages, and docs must stand on their own for a reader who
was not in the session. Avoid conversation-dependent or positional references
("above", "as requested"), and state the requirement explicitly.

## Testing Preferences

Test observable behavior rather than implementation details. Prefer real
collaborators when they are fast and deterministic; use mocks or fakes where
boundaries are hard to control. Avoid tests that break on harmless
refactoring.

## Runtimes

Tools are managed machine-wide by `mise`, with shims on `PATH`. Invoke them
directly (do not use `mise exec`), and pin versions with
`mise use <tool>@<version>`.
