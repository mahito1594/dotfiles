# dotfiles

[chezmoi](https://www.chezmoi.io) で管理しています。

## Daily operation

TBA.

## Setup

### Install (macOS)

```bash
brew install chezmoi
chezmoi init git@github.com:mahito1594/dotfiles.git
```

#### Other tools

```bash
brew install mise
brew install --cask alacritty ghostty font-plemol-jp-nf
```

## Configuration

### Zsh

`$HOME/.zshenv` に以下を記述します:

```sh
export ZDOTDIR=${ZDOTDIR:-$HOME/.config/zsh}
[ -f $ZDOTDIR/.zshenv ] && source $ZDOTDIR/.zshenv
```

### Claude Code

#### [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)

mise で `github:DeusData/codebase-memory-mcp` をインストールした後、MCP サーバーを設定します:

```bash
claude mcp add --scope user --transport stdio codebase-memory-mcp -- codebase-memory-mcp
```
