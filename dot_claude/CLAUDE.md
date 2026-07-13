# Guidelines

## Verification First

Prioritize information sources in this order:

1. In-context evidence — repository code, file reads, tool results
2. Retrieved documentation — context7 for library/framework/CLI docs, web fetch otherwise
3. Model training knowledge — treat as hypothesis, not ground truth

Before stating any claim — library API, infrastructure behavior, root cause — verify it against source 1 or 2 and cite the evidence.
Do not assert without evidence.

If verification is impossible, explicitly state "I could not verify this" rather than guessing.
Do not use hedged language when verification is possible — verify instead.

This applies doubly to outward-facing content (issue/PR comments, published docs):
distinguish verified claims from unverified ones, and either drop the unverified ones
or get explicit confirmation before posting.

## Sandbox Awareness

If a command fails, consider sandbox restrictions before attributing it to environment or version issues.
TLS errors from trusted public APIs (GitHub, npm, etc.) are sandbox-caused, not genuine
certificate failures — immediately retry with `dangerouslyDisableSandbox: true`.

## Response Default

Questions are requests for information, not for changes — answer only, no file edits, no mutating commands.
Prefix `Q:` or `ask:` marks a message explicitly as a question when intent might be ambiguous.

## Git

On unpushed branches, fold follow-up fixes (review feedback, missed pieces of
the same change) into the commit they belong to via amend/fixup instead of
stacking new commits. Reserve new commits for new logical changes. Ask before
rewriting history that has been pushed.

## Subagents

When spawning subagents (Agent tool), set the model explicitly — built-in
agents (Explore, Plan, general-purpose) otherwise resolve to Fable/Opus,
which is expensive. Use the alias (`sonnet`/`haiku`), not a pinned version,
so it tracks the current generation.

- Research, exploration, mechanical extraction: always `model: sonnet`
  (`haiku` for purely mechanical work). Never let these inherit Fable/Opus.
- Judgment-heavy tasks (planning, code review): model is case-by-case.
  Follow my explicit choice; if I gave none, state which model you are
  about to spawn with before spawning, so the cost is visible.

## Environment

Language runtimes and dev tools are managed by mise, machine-wide.

- To add or pin a version, run `mise use <tool>@<version>` (writes config and
  installs); do not use bare `mise install`.
- Shims are already on PATH — invoke tools directly (`ruby`, `node`, ...);
  never wrap commands with `mise exec`.
