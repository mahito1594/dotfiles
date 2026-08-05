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
brew install --cask alacritty font-plemol-jp-nf
```

## Configuration

### Zsh

TBA:

- XDG Base Directory に従うための手順を書く
- [zimfw](https://github.com/zimfw/zimfw) のセットアップについて書く

### Claude Code

#### [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)

mise で `github:DeusData/codebase-memory-mcp` をインストールした後、MCP サーバーを設定します:


```bash
claude mcp add --scope user --transport stdio codebase-memory-mcp -- codebase-memory-mcp
```
