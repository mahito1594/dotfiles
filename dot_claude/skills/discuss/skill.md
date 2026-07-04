---
name: discuss
description: "Enter or exit design discussion mode. /discuss starts a focused design conversation that blocks file edits via a lock file ($CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock). /discuss end removes the lock, summarizes the outcomes, and stops at the junction so the user chooses the next step (plan mode, model switch, record-only, or park). Trigger on: /discuss, 'start discussion', 'design discussion', /discuss end, 'end discussion', 'exit discussion mode'."
---

# Discussion Mode

State is tracked via a lock file (`$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock`). The global `PreToolUse` hook reads it and blocks `Edit`/`Write` calls while the file exists. Code snippets in the conversation are fine for illustration — only file writes are blocked.

## `/discuss [topic]` — Enter discussion mode

1. Create the lock file:

```bash
touch "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock"
```

2. Announce that discussion mode is now active and file edits are blocked.
3. If the session is not running on a Fable-class model, mention once that design discussions benefit from `/model fable`, then drop the subject.
4. If a `[topic]` argument was provided, acknowledge it and open the discussion focused on that topic. If no argument, wait for the user to lead.

## During discussion

- Delegate research (docs lookup, source reading, log analysis) to subagents with `model: sonnet`, or `haiku` for mechanical extraction. Keep the main thread on synthesis and trade-off judgment.
- Track outcomes as they emerge: decisions made, alternatives rejected (with reasons), open questions.

## `/discuss end` — Exit discussion mode

1. Summarize the discussion first: decisions / rejected alternatives (with reasons) / open questions. Flag any decision with lasting consequences as an ADR draft candidate.
2. Remove the lock file:

```bash
rm -f "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock"
```

3. State the junction and stop. Do NOT call EnterPlanMode yourself: entering plan mode locks the current model in as the planner, and switching models is a user action. Whether to plan and which model plans are independent choices, so lay out the options and let the user pick:
   - **Plan with the current model** — the user asks for plan mode.
   - **Plan with a different model** — the user runs `/model` first; the conversation context survives the switch, so no handoff file is needed.
   - **Record-only outcome** — on request, write the decision where it belongs (ADR draft, stories, config).
   - **Parked** — the summary's open questions are the record; stop there.

   As a hint for the choice: if the discussion settled the design and only translation into steps remains, a smaller model can plan; if open questions remain, planning with the current model is safer.
