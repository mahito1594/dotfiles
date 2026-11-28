#!/usr/bin/env node
// SessionStart hook: when Claude Code runs inside a Rex terminal
// (REX_BLOCK is set), tells the model to keep long-lived processes in Rex
// tabs instead of background Bash tasks, so the user can watch them and
// they can be stopped and restarted in place. Silent outside Rex.
// Registered for SessionStart only: subagents opening their own tabs would
// give a dev server or port more than one owner.
// The sandbox caveat (Rex-started processes run unsandboxed) lives in
// sandbox-context.mjs, because the Rex socket is reachable whether or not
// the session runs inside a Rex terminal.
// Hook input/output fields: https://code.claude.com/docs/en/hooks
import { readFileSync } from "node:fs";

function main() {
  const input = JSON.parse(readFileSync(0, "utf8"));
  if (!process.env.REX_BLOCK) return;

  const output = {
    hookEventName: input.hook_event_name,
    additionalContext: contextText,
  };
  console.log(JSON.stringify({ hookSpecificOutput: output }));
}

const contextText = `This session runs inside a Rex terminal. Run long-lived processes that you will watch, stop, or restart (dev servers, crit, file watchers) in Rex tabs, not as background Bash tasks:
 - Give each process its own tab. Open it with --focus=false and start the process by sending the command to the tab's shell, so it can be stopped and restarted in the same pane.
 - Read output with \`rex capture\`. Stop the process with \`rex send-key <block> ctrl+c\`.
 - When the task is done, close the tabs you opened.
 - Keep one-shot commands whose result is all you need (tests, \`codex exec\`) as Bash calls.
See the rex skill for commands.`;

main();
