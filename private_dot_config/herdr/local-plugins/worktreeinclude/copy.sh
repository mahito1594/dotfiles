#!/usr/bin/env bash
# Copies files matched by the main checkout's .worktreeinclude into a newly created worktree.
# Like Claude Code's .worktreeinclude, only files that are also gitignored are copied.
set -euo pipefail

event=${HERDR_PLUGIN_EVENT_JSON:-}
dst=$(jq -r '.data.worktree.path // .worktree.path // empty' <<<"$event")
if [[ -z $dst || ! -d $dst ]]; then
  echo "worktreeinclude: no worktree path in event: $event" >&2
  exit 1
fi

# The first entry of `git worktree list` is always the main checkout.
src=$(git -C "$dst" worktree list --porcelain | sed -n '1s/^worktree //p')
[[ -n $src && $src != "$dst" && -f $src/.worktreeinclude ]] || exit 0

cd "$src"
# tar -k keeps files that already exist in the worktree.
git ls-files -z --others --ignored --exclude-from=.worktreeinclude \
  | { git check-ignore -z --stdin || true; } \
  | tar -cf - --null -T - \
  | tar -xkpf - -C "$dst"
