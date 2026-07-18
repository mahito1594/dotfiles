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

- Work from an agreed design. Plan mode is the agreement layer: overall
  design that needs the user's sign-off is planned and approved there.
  Orchestrate never re-opens or substitutes for that approval. If no
  agreed source exists (approved plan, accepted review findings, explicit
  instruction), get agreement before the first delegation — plan mode for
  nontrivial designs, a unit-breakdown confirmation in chat for small ones.
- Enter plan mode yourself (EnterPlanMode) when that check fails — at task
  intake, when a new task arrives mid-session, or when an escalation shows
  the agreed design must change. The plan approved at ExitPlanMode is the
  agreement the orchestrate document then curates.
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

- The orchestrate document is the delegation layer, not the agreement
  layer. Write it at invocation, derived from the agreed source; it needs
  no separate approval, but record the derivation at the top
  ("Derived from: <path or agreement>, <date>") and copy what implementers
  need — plansDirectory files are auto-named plan-mode artifacts and may
  be cleaned up, so the document stays self-contained.
- Design decisions that are new at curation time (unit boundaries aside,
  anything the agreed source doesn't cover) are shown to the user before
  the first delegation, not silently added.
- One document per task at `.claude/orchestrate/<task-slug>.md` in the
  project, untracked, with one section per unit. It must exist on disk
  before the first delegation — subagents cannot see the conversation.
  Unit sections may be written just-in-time as earlier units land; the
  shared header (verification commands, project rules, commit plan) is
  written first.

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
