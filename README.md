# dotfiles

[chezmoi](https://www.chezmoi.io) 管理の dotfiles。
設定は XDG 配下に配置し、CLI ツールは `mise` でインストールする。

## セットアップ

新しいマシンで順に実行する。

```bash
brew install chezmoi mise
brew install --cask alacritty ghostty font-plemol-jp-nf font-moralerspace-hw-jpdoc
chezmoi init --apply git@github.com:mahito1594/dotfiles.git
```

chezmoi 管理外の `$HOME/.zshenv` だけは手で作る:

```sh
export ZDOTDIR=${ZDOTDIR:-$HOME/.config/zsh}
[ -f $ZDOTDIR/.zshenv ] && source $ZDOTDIR/.zshenv
```

シェルを開き直すと `.zprofile` が Homebrew の `shellenv` と`mise activate zsh --shims` を評価するので、続けてツールを入れる:

```bash
mise install
```

> [!INFO]
> 初回の `.zshrc` が sheldon / fzf / worktrunk のキャッシュを作る。
> `mise install` より前に開いたシェルはプロンプトや補完が欠けるため開き直すこと。
