#!/usr/bin/env node
// SessionStart / SubagentStart hook: tells the model which Bash commands
// sandbox.excludedCommands takes out of the sandbox, which call shapes put
// them back in, and how to recover from a failure without the user.
// Silent unless sandbox.enabled is true and excludedCommands is non-empty.
// Hook input/output fields: https://code.claude.com/docs/en/hooks
//
// Maintenance: the call-shape list in contextText restates the
// sandbox.excludedCommands entry of
// https://code.claude.com/docs/en/settings-reference (which calls its list
// non-exhaustive) and https://code.claude.com/docs/en/sandboxing; the pipe
// and VAR=value entries are not documented there and come from observed
// behavior. It can drift as Claude Code changes. After a Claude Code
// update, compare it with those pages, then confirm each shape by asking
// Claude to run, inside a sandboxed session:
//   git config --file ~/sandbox-probe.ini probe.key 1
//   git config --file ~/sandbox-probe.ini probe.key 1 | cat
// The plain call should succeed and the piped one fail with a permission
// error, since the sandbox cannot write to ~. Swap `| cat` for each other
// shape (`2>&1`, `cd . &&`, `X=1 ` prefix, ...) to see which ones sandbox
// the call, then delete ~/sandbox-probe.ini.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function main() {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const project = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
  const { enabled, patterns } = loadSandboxSettings(project);
  if (!enabled || !patterns.length) return;

  const output = {
    hookEventName: input.hook_event_name,
    additionalContext: contextText(patterns),
  };
  console.log(JSON.stringify({ hookSpecificOutput: output }));
}

// Ascending precedence: a later file overrides `enabled` from an earlier one;
// excludedCommands from all files are merged.
function loadSandboxSettings(project) {
  return [
    join(homedir(), ".claude/settings.json"),
    join(project, ".claude/settings.json"),
    join(project, ".claude/settings.local.json"),
  ]
    .map(readSandboxSection)
    .filter(Boolean)
    .reduce(
      (acc, sandbox) => ({
        enabled: typeof sandbox.enabled === "boolean" ? sandbox.enabled : acc.enabled,
        patterns: [...new Set([...acc.patterns, ...(sandbox.excludedCommands ?? [])])],
      }),
      { enabled: false, patterns: [] },
    );
}

function readSandboxSection(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8")).sandbox;
  } catch {
    return undefined; // missing or unparsable file
  }
}

const contextText = (patterns) => `This adds to the Bash sandbox guidance in your instructions. This session's settings exclude these command patterns from the sandbox (sandbox.excludedCommands): ${patterns.join(", ")}.

A Bash call runs outside the sandbox only when every command in it matches one of these patterns and the call has none of the following shapes. Any of them puts the whole call back in the sandbox, together with every process it spawns, git hooks included:
 - a pipe, a redirection, or a heredoc (2>&1 is the exception)
 - a command substitution $(...), a subshell, or an if/for block
 - cd, pushd, or popd; a leading sudo, eval, or xargs; or a VAR=value prefix
 - git -C

So run each excluded command as a call of its own, in its plain form. The working directory is already the project directory, and output can be trimmed after the result arrives. For a commit message body, repeat -m instead of passing a heredoc to -F -.

When a call fails, first work out whether it ran in the sandbox:
 - If it held only excluded commands in their plain form, it ran outside the sandbox and the error is real (credentials, network, hook output, repository state). Diagnose it as usual.
 - If it mixed an excluded command with anything else, it ran in the sandbox, where "Operation not permitted" and credential, host-key, proxy, TLS, or DNS errors are expected. Re-run the excluded command alone right away. That re-run is the intended way out of the sandbox, not a change to its settings, so it needs no approval from the user.
 - If the failing command matches none of the patterns, splitting the call will not help. Tell the user which restriction it hit and give them \`! <command>\` to run.
 - If the excluded command also fails when run alone, quote the error and give the user \`! <command>\`.`;

main();
