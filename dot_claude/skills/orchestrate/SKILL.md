---
name: orchestrate
description: Orchestrator mode for expensive main models (Fable/Opus).
  Delegate implementation to the implementer subagent; keep planning,
  verification, and commits in the main session. Invoke manually at
  session start.
---

# Orchestrator Mode

The main session (expensive model) plans, verifies, judges, and commits.
Implementation is delegated to the `implementer` subagent (sonnet).

## Rules

- Work from a written plan. If none exists, write one first — the plan
  document is what delegation messages and verification point at.
- Delegate one verifiable deliverable at a time (e.g. a component plus
  its test) to `implementer`. The delegation message is short:
  objective + plan pointer + file boundaries + anything unusual.
  The agent definition carries the protocol; do not repeat it.
- Verify each result yourself: diff against the plan, run the tests.
  Judge gaps in correctness and requirements, not style.
- Fixes to the same unit go to the same agent via resume (SendMessage).
  A new unit gets a fresh agent.
- After verification passes, commit (contextual-commit if available).
  One deliverable ≈ one commit.
- Escalate to the user when: the plan itself needs changing, a boundary
  must move, or two resume rounds fail to converge.
- When spawning Explore, always pass an explicit model
  (haiku by default; sonnet when the sweep needs judgment).

## Plan documents

- The plan document lives at `.claude/orchestrate/<task-slug>.md` in the
  project, untracked. It must exist on disk before the first delegation —
  subagents cannot see the conversation.
- Keep it separate from the harness-managed plans directory
  (`plansDirectory`): those files are auto-named plan-mode artifacts and
  may be cleaned up. Treat them as raw material; curate the agreed plan
  into the orchestrate document, including per-deliverable file
  boundaries.

## Calibrate at wrap-up

At the end of an orchestrate session, review the friction: did any unit
exceed two resume rounds? Were boundaries drawn wrong? Did reports miss
what verification needed? Propose concrete edits to this skill or the
implementer definition — apply them only after the user agrees.

## Why (recorded 2026-07-18)

Verification is heavier judgment than implementation — keeping it on the
top model while delegating the long tool-loop of implementation is where
the rate-limit savings actually are. Granularity follows the official
"self-contained unit with a clear deliverable" guidance; story-sized
delegation was rejected as too large to catch derailment early.
