# pi-synthetic

[Docker Sandbox Kit Specification](https://github.com/docker/sandbox-kit-spec) v3 に基づく、
pi coding agent の mixin です:

- [@aliou/pi-synthetic](https://github.com/aliou/pi-synthetic) を用いて [synthetic.new](https://synthetic.new) を provider として利用する
- 最小限の [AGENTS.md](./files/AGENTS.md) および [APPEND_SYSTEM.md](./files/APPEND_SYSTEM.md) を追加する

## 利用方法

### API key の発行

[synthetic.new のコンソール](https://dev.synthetic.new/docs/api/overview) から API key を取得し、sbx に登録してください。

```sh
sbx secret set synthetic
```

### ビルド・実行

2026-11-03 現在、docker hub の [sbx/pi](https://hub.docker.com/r/sbx/pi) が同梱する pi のバージョンが `0.86.1` のため、ローカルでビルドする必要があります。

```sh
sbx run \
  "git+https://github.com/docker/sbx-kits-contrib.git#ref=v3&dir=pi" \
  --kit sbx/mise:latest \
  --kit ~/.config/docker-sandbox-kit/pi-synthetic \
  --kit-arg pi.version=1.5.0 \
```
