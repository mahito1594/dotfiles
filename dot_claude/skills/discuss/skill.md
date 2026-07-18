---
name: discuss
description: "Enter or exit design discussion mode. /discuss starts a focused design conversation that blocks file edits via a lock file ($CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock). /discuss end removes the lock, summarizes the outcomes, and stops at the junction so the user chooses the next step (plan mode, model switch, orchestrate, handoff, record-only, or park). Trigger on: /discuss, 'start discussion', 'design discussion', /discuss end, 'end discussion', 'exit discussion mode'."
---

# Discussion Mode

State is tracked via a lock file (`$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock`). The global `PreToolUse` hook reads it and blocks `Edit`/`Write` calls while the file exists. The hook matches only those two tools: file writes through other routes (Bash redirection, `sed -i`, heredocs, NotebookEdit) are not blocked mechanically — avoid them yourself while the lock exists. Code snippets in the conversation are fine for illustration — only file writes are off-limits.

## `/discuss [topic]` — Enter discussion mode

1. If the lock file already exists, discussion mode is already active: keep the running record and treat any new `[topic]` as a topic shift, not a fresh start. Otherwise create the lock file and confirm it exists:

```bash
touch "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock" && test -f "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock"
```

2. Announce that discussion mode is now active and file edits are blocked. If the lock could not be created, announce instead that the hook protection is NOT active and edits are held off by convention only.
3. If a `[topic]` argument was provided, acknowledge it and open the discussion focused on that topic. If no argument, wait for the user to lead.

## During discussion

- Inline research pollutes the main context: each lookup accelerates compaction and degrades the end-of-discussion summary. Delegate research to subagents (`model: sonnet`, or `haiku` for mechanical extraction) and keep the main thread on synthesis and trade-off judgment. Research includes: doc queries via context7 or WebFetch, probing external APIs with curl, and exploring dependency internals (node_modules, vendored code).
- Quick inline checks of the project's own files (reading 1–2 files, listing a directory) are exempt from the rule above. But when quick checks start chaining — a second consecutive lookup serving the same question — treat the chain as a research theme: stop and delegate the theme, not the individual lookup.
- Example: instead of running `curl https://api.example.com/...` three times to learn a response shape, spawn one subagent: "Investigate this API's response structure and report only the essentials."
- Track outcomes as they emerge: decisions made, alternatives rejected (with reasons), open questions. Whenever the record changes, restate it in the conversation in compact form — one line per item (`Decided: X — reason / Rejected: Y — reason / Open: Z`). Skip the restatement on turns where nothing changed.

## Discussion conduct

- Every option survey ends with your recommendation and its reason. If you have no position, say what evidence would give you one.
- Name the trade-off before recommending: what is gained, what is given up.
- On pushback, judge the argument, not the person's confidence: either defend your position with reasons or concede and state exactly what changed your mind. Never concede merely to agree.
- At most one question per turn, aimed at whatever would most change the decision.

## `/discuss end` — Exit discussion mode

1. If the lock file does not exist, say that no discussion mode is active and stop — do not force a summary onto an ordinary conversation. Otherwise summarize the discussion first: decisions / rejected alternatives (with reasons) / open questions. Flag any decision with lasting consequences as an ADR draft candidate.
2. Remove the lock file:

```bash
rm -f "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock"
```

3. State the junction and stop. Do NOT call EnterPlanMode yourself: entering plan mode locks the current model in as the planner, and switching models is a user action. Whether to plan and which model plans are independent choices, so lay out the options and let the user pick:
   - **Plan with the current model** — the user asks for plan mode.
   - **Plan with a different model** — the user runs `/model` first; the conversation context survives the switch, so no handoff file is needed.
   - **Handoff** — on request, write the summary (same structure as step 1) plus pointers to relevant files to `.claude/discuss-handoff.md` in the project, for continuing the discussion in a fresh session. Record judgments only; facts stay as pointers.
   - **Orchestrate** — the design is settled and implementation will be delegated: the user invokes `/orchestrate`; the summary seeds the plan document (`.claude/orchestrate/<slug>.md`) and implementation goes to the implementer subagent.
   - **Record-only outcome** — on request, write the decision where it belongs (ADR draft, stories, config).
   - **Parked** — the summary's open questions are the record; stop there.

   As a hint for the choice: if the discussion settled the design and only translation into steps remains, a smaller model can plan; if open questions remain, planning with the current model is safer.
