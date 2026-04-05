---
name: dual-review
description: "Dual-AI pull request review that runs both Claude and OpenAI Codex as independent reviewers, merges their findings into a unified report, and can apply fixes with Codex re-review. Use this skill when the user wants multiple AI perspectives on a PR: mentions reviewing with Codex, asks for dual/combined review, wants both Claude and Codex opinions, or says things like 'codex にもレビューさせて', 'codex と一緒にレビュー', 'review PR with codex', 'dual review PR 123'. Do NOT trigger for simple PR reviews that don't mention Codex or dual/combined review — those belong to the code-review command."
---

# Dual-AI Pull Request Review

Two independent AI reviewers (Claude + Codex) examine the same PR, then their findings are merged into one unified report. Each reviewer has different strengths — Claude excels at framework-specific patterns and runtime lifecycle issues, while Codex tends to focus on accessibility and interaction models. Running both gives broader coverage than either alone.

## Arguments

The user provides a PR number: `/dual-review 240` or "dual review PR 240".
If no number is given, ask for one via `AskUserQuestion`.

## Phase 1: Gather PR Information

Fetch PR metadata and diff in parallel:

```bash
gh pr view <number> --json title,body,headRefName,baseRefName,additions,deletions,files,commits
gh pr diff <number>
```

Then read the full contents of each changed file (not just the diff) for context.

## Phase 2: Ask Codex Configuration

Use `AskUserQuestion` to ask the user **two questions in a single prompt**:

1. Which Codex model: `gpt-5.4` (recommended), `gpt-5.3-codex` (complex software engineering), or `gpt-5.4-mini` (fast/lightweight)
2. Which reasoning effort: `xhigh`, `high`, `medium`, or `low`

## Phase 3: Run Both Reviews in Parallel

Launch Claude and Codex reviews at the same time — don't wait for one before starting the other.

### Claude Review

Use the `feature-dev:code-reviewer` agent with these inputs:

- Full contents of all changed files (not just diffs)
- PR description and commit messages for context
- Focus areas: bugs, logic errors, security (XSS/injection), accessibility, code quality, project convention adherence
- Confidence-based filtering: only report high-priority issues

### Codex Review

Run Codex in read-only sandbox:

```bash
echo '<review prompt>' | codex exec --skip-git-repo-check -m <model> --config model_reasoning_effort="<effort>" --sandbox read-only -C <repo-root> 2>/dev/null
```

The review prompt should include:

- The list of changed files with instructions to read each one
- Request for structured review with severity levels
- Focus on high-confidence issues only
- Same focus areas as the Claude review

Always append `2>/dev/null` to suppress Codex thinking tokens.

## Phase 4: Merge and Present Results

Combine both reviews into a unified report. Deduplicate findings that overlap (even if worded differently) and note which reviewer(s) detected each one.

### Output Format

```markdown
## PR #<number> Unified Review: Claude + Codex

**PR**: <title>
**Changes**: +<additions> / -<deletions> (<file count> files)

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

### Checked and Clean

- **XSS**: no issues found
- (other areas checked)
```

Sorting: Critical > Important > Medium > Low.

## Phase 5: Fix Issues (when instructed)

Only fix issues when you determine they are warranted OR the user explicitly asks.

1. Present a concise fix plan (one line per change)
2. Apply fixes incrementally — one issue at a time, minimal changes
3. Run relevant tests after each fix
4. Run the full test suite after all fixes

## Phase 6: Post-Fix Re-Review via Codex Resume

After fixes are applied, use Codex resume to re-review. This preserves the original session context so Codex can verify its earlier findings are resolved and catch any new issues from the fixes.

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
