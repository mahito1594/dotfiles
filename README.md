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

#### RTK (Rust Token Killer)

`mise install` で [rtk](https://github.com/rtk-ai/rtk) をインストールした後、hook を設定します。

```sh
rtk init -g
```

CLAUDE.md への instruction は追加しません。

#### semble

`mise install` で [semble](https://github.com/MinishLab/semble) をインストールした後、
instruction / MCP Server / subagent を設定します。

```sh
semble install
```
