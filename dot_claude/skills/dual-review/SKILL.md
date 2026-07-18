---
name: dual-review
description: "Dual-AI pull request review that runs both Claude and OpenAI Codex as independent reviewers, merges their findings into a unified report, and can apply fixes with Codex re-review. Use this skill when the user wants multiple AI perspectives on changes: mentions reviewing with Codex, asks for dual/combined review, wants both Claude and Codex opinions, or says things like 'codex にもレビューさせて', 'codex と一緒にレビュー', 'review PR with codex', 'dual review PR 123', 'codex とローカルの変更をレビュー', 'dual review my branch'. Works with both GitHub PRs and local uncommitted/branch changes. Do NOT trigger for simple PR reviews that don't mention Codex or dual/combined review — those belong to the code-review command."
---

# Dual-AI Review

Two independent AI reviewers (Claude + Codex) examine the same changes, then their
findings are merged into one unified report. The two tend to surface different
issues, and which reviewer catches what depends on the nature of the change — on
UI/accessibility-heavy diffs Codex often leads on a11y and interaction concerns
while Claude leads on framework and runtime patterns, but on logic- or
config-heavy changes this can reverse. Running both gives broader coverage than
either alone.

**Default scope is review only: gather → review → merge → report, then stop.**
Applying fixes and re-reviewing (Phases 5–6) are manual follow-ups, run only when
the user explicitly asks — not an automatic continuation of the flow.

## Arguments

Two modes are supported:

**PR mode**: `/dual-review 240` or "dual review PR 240"
**Local mode**: `/dual-review` or `/dual-review --base main`

- If a PR number is given, fetch from GitHub.
- If no number is given, review local changes. Default base is `main`; override with `--base <ref>`.
  - If `--base` is not specified and HEAD has no commits ahead of main, fall back to staged+unstaged changes (`git diff HEAD`).

## Phase 1: Gather Review Targets

**PR mode:**

Fetch PR metadata and diff in parallel:

```bash
gh pr view <number> --json title,body,headRefName,baseRefName,additions,deletions,files,commits
gh pr diff <number>
```

**Local mode:**

Determine changed files and the diff:

```bash
# Count commits ahead of base
git rev-list --count <base>...HEAD

# List changed files
git diff --name-only <base>...HEAD   # branch comparison
# or
git diff --name-only HEAD            # uncommitted changes fallback
```

Then read the full contents of each changed file (not just the diff) for context.

## Phase 2: Choose Models and Effort

Use `AskUserQuestion` to ask the reviewer configuration explicitly, every run — both
wings and the effort are visible choices; nothing is derived or silently prescribed.
Match the choices to the size and risk of the change: large or security-sensitive
changes warrant the flagship pair at high effort, while small low-risk PRs run fine
on the balanced pair at medium (no numeric thresholds — judge per change).

Ask in a single prompt, putting the recommended option first with a
"(Recommended)" label:

1. **Claude reviewer model** — `opus` (recommended; large or security-sensitive
   changes) or `sonnet` (small, low-risk changes).
2. **Codex model** — `gpt-5.6-sol` (recommended; pairs with opus) /
   `gpt-5.6-terra` (pairs with sonnet) / `gpt-5.6-luna` (fast, cost-sensitive).
   Older generations or anything else the user names go through the free-text
   option.
3. **Codex reasoning effort** — `high` (recommended) / `medium` / `xhigh`.
   The full range is `low`–`ultra`: `max` needs a 5.6-generation model, `ultra`
   needs sol/terra. Reserve `max`/`ultra` for especially critical reviews (pick
   via the free-text option).

After the answers come back, **validate the combination before proceeding**:
`ultra` runs only on sol/terra, and `max` only on a 5.6-generation model. If the
chosen effort is incompatible with the chosen model, point out the conflict and
re-ask the conflicting item — do not silently proceed or silently substitute a
different value.

Coherent pairs, for reference: `opus` × `gpt-5.6-sol` × `high` (flagship tier) and
`sonnet` × `gpt-5.6-terra` × `medium` (balanced tier). Mixed pairs are legitimate
when the change calls for it — the questions above never force a pairing.

<!--
  MODEL MAINTENANCE POINT — current-generation options listed as of 2026-07. This
  block is the single place model names live in this skill; update it here when a
  generation changes rather than scattering names through the phases. Do NOT inherit
  `~/.codex/config.toml` (it lags) and do NOT parse `models_cache.json` (internal,
  schema-unstable) — list the options here and let the user pick.
  Codex gpt-5.6: sol=flagship ($5/$30), terra=balanced ($2.5/$15), luna=fast ($1/$6).
  Claude: opus-4-8 is the code-review flagship; sonnet is the balanced tier; fable is
  a premium exception (~2x price, always-on thinking, no prefill) — explicit-request
  only. There is no Codex counterpart to fable in 5.6 (no separate -pro slug).
-->

Codex model options: `gpt-5.6-sol` (flagship) · `gpt-5.6-terra` (balanced) ·
`gpt-5.6-luna` (fast) · or a specific/older model the user names.

Carry the chosen `<claude-model>`, `<codex-model>`, and `<effort>` into Phase 3.

## Phase 3: Run Both Reviews in Parallel

Launch Claude and Codex reviews at the same time — don't wait for one before starting the other.

### Claude Review

Use the `feature-dev:code-reviewer` agent with an **explicit model** (never leave it
unset — it would resolve to an expensive default): pass the `<claude-model>` chosen
in Phase 2.

- Inputs: full contents of all changed files (not just diffs); PR description /
  branch name and base ref for context.
- Focus areas: bugs, logic errors, security (XSS/injection), accessibility, code
  quality, project convention adherence.
- Confidence-based filtering: only report high-priority issues.

### Codex Review

Run Codex in read-only sandbox. **Write the review prompt to a scratchpad file and
pipe it in** — `echo '<prompt>'` breaks on long prompts (quotes, backticks,
newlines), so a file is the reliable path:

```bash
# Write the prompt to $CLAUDE_TMPDIR (or the session scratchpad dir) first, then:
cat <prompt-file> | codex exec --skip-git-repo-check -m <codex-model> \
  --config model_reasoning_effort="<effort>" --sandbox read-only -C <repo-root> 2>/dev/null
```

For a very short prompt, inline `echo '...'` is acceptable, but default to the file.

The review prompt should include:

- The list of changed files with instructions to read each one
- Request for structured review with severity levels
- Focus on high-confidence issues only
- Same focus areas as the Claude review

`2>/dev/null` suppresses Codex thinking tokens (it also hides stderr errors — if a
run returns nothing, re-run without it to see the error).

## Phase 4: Merge and Present Results

**Wait for both reviewers to finish before merging.** Do not emit an intermediate
report from whichever wing returns first — the value is in the cross-check, which
requires both. Once both are in, combine them into a unified report. Deduplicate
findings that overlap (even if worded differently) and note which reviewer(s)
detected each one.

### Output Format (PR mode)

```markdown
## PR #<number> Unified Review: Claude + Codex

**PR**: <title>
**Changes**: +<additions> / -<deletions> (<file count> files)
**Reviewers**: Claude <claude-model> × Codex <codex-model> (effort: <effort>)

---

### Findings

| #   | Severity      | Finding           | Detected By           |
| --- | ------------- | ----------------- | --------------------- |
| 1   | **Important** | Brief description | Claude / Codex / Both |

---

### Detail per Finding

#### 1. [Important] Finding title — Detected by X

**`file:line`**

Explanation and suggested fix.

---

### Disagreements & Rejected

One reviewer raised these; the cross-check judged them not actionable. Listed for
transparency (Codex is a peer, not an authority).

| Raised by | Claim              | Verdict  | Reason                        |
| --------- | ------------------ | -------- | ----------------------------- |
| Codex     | Brief claim        | Rejected | Why it doesn't hold           |

---

### Checked and Clean

- **XSS**: no issues found
- (other areas checked)
```

### Output Format (Local mode)

```markdown
## Local Review: <branch> vs <base> — Claude + Codex

**Branch**: <branch-name>
**Base**: <base-ref>
**Changes**: <file count> files
**Reviewers**: Claude <claude-model> × Codex <codex-model> (effort: <effort>)

---

### Findings

(same table as PR mode)

---

### Detail per Finding

(same structure as PR mode)

---

### Disagreements & Rejected

(same structure as PR mode)

---

### Checked and Clean

(same structure as PR mode)
```

Sorting: Critical > Important > Medium > Low.

---

The default flow ends here. The steps below run **only when the user explicitly
asks** — applying fixes is a separate activity from reviewing, and the skill does
not flow into it on its own.

## Phase 5: Fix Issues (manual follow-up)

Run only on explicit request.

1. Present a concise fix plan (one line per change)
2. Apply fixes incrementally — one issue at a time, minimal changes
3. Run relevant tests after each fix
4. Run the full test suite after all fixes

## Phase 6: Post-Fix Re-Review via Codex Resume (manual follow-up)

Run only on explicit request, after Phase 5. Codex resume preserves the original
session context so Codex can verify its earlier findings are resolved and catch any
new issues from the fixes.

```bash
echo 'I have applied fixes for all issues you identified. Please re-review the changed files to verify the fixes are correct and check for any new issues. The fixes were: <brief summary>' | codex exec --skip-git-repo-check resume --last 2>/dev/null
```

The resume command must not include model/effort/sandbox flags — those are inherited from the original session.

If the re-review finds new issues, present them and fix if needed (repeat Phase 5-6).

## Key Principles

- **Codex is a peer, not an authority.** If Codex flags something you believe is wrong, say so with evidence and let the user decide.
- **Do not post to GitHub** unless the user explicitly asks. Default is local-only output.
- **Parallel execution matters.** Both reviews should run simultaneously to minimize wall-clock time. Use the Agent tool for the Claude review and Bash for the Codex review in the same message.
- **Explain disagreements.** When Claude and Codex disagree, present both viewpoints and your assessment of which is correct.
- **Mode is transparent.** Always state at the top whether reviewing a PR or local changes, which base ref is being used, and which models and effort were applied.
