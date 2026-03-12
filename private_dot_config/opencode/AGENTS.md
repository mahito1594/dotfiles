# Agent Guidelines

## Verification

Do not assert library or API behavior without a source.

If repository code does not show the behavior,
retrieve documentation using context7.

## Tool Usage

Use context7 to verify:
- library APIs
- framework configuration
- CLI flags

Avoid context7 for:
- language fundamentals
- refactoring existing code.

## Development

Make incremental changes that compile and pass tests.

## Code Quality

Avoid premature abstractions.
Prefer simple implementations.