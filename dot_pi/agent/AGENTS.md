# AGENTS.md

Prefer simple, explicit, robust solutions over clever or unnecessarily abstract ones.
Provide architectural advice when useful, not only code changes.

## Implementation preferences

Prefer pure transformations, explicit data flow, and limited shared mutable state
where they improve clarity. Follow the language, framework, and project style.

## Testing preferences

Test observable behavior rather than implementation details. Prefer real collaborators
when they are fast and deterministic; use mocks or fakes where boundaries are difficult
to control. Avoid tests that break due to harmless refactoring.
