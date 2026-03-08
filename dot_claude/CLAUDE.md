# Guidelines

## Verification First

- Before asserting library/API behavior, ensure you have a source (recent tool result, file read, or docs); if not, verify with context7
- When a recommendation is questioned, explain reasoning with evidence before reconsidering
- Do not retract a recommendation unless the user provides new information or explicitly asks

## Sandbox Awareness

- When a command fails, consider sandbox restrictions before attributing to environment/version issues. Retry with `dangerouslyDisableSandbox: true` to confirm

## Development Philosophy

- Incremental progress over big bangs - small changes that compile and pass tests
- Pragmatic over dogmatic - adapt to project reality

## Code Quality

- Avoid premature abstractions
- Choose the well-understood solution over the clever one
