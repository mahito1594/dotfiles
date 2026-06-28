---
name: discuss
description: "Enter or exit design discussion mode. /discuss starts a focused design conversation that blocks file edits via a lock file ($CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock). /discuss end removes the lock and switches to plan mode. Trigger on: /discuss, 'start discussion', 'design discussion', /discuss end, 'end discussion', 'exit discussion mode'."
---

# Discussion Mode

State is tracked via a lock file (`$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock`). The global `PreToolUse` hook reads it and blocks `Edit`/`Write` calls while the file exists. Code snippets in the conversation are fine for illustration — only file writes are blocked.

## `/discuss [topic]` — Enter discussion mode

1. Create the lock file:

```bash
touch "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock"
```

2. Announce that discussion mode is now active and file edits are blocked.
3. If a `[topic]` argument was provided, acknowledge it and open the discussion focused on that topic. If no argument, wait for the user to lead.

## `/discuss end` — Exit to plan mode

1. Remove the lock file:

```bash
rm -f "$CLAUDE_TMPDIR/discuss-$CLAUDE_CODE_SESSION_ID.lock"
```

2. Call `EnterPlanMode`.
3. Once in plan mode, say: "Based on our discussion, please create a plan file."
