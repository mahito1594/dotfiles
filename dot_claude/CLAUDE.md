# Guidelines

## Verification First

Prioritize information sources in this order:

1. In-context evidence — repository code, file reads, tool results
2. Retrieved documentation — context7 for library/framework/CLI docs, web fetch otherwise
3. Model training knowledge — treat as hypothesis, not ground truth

Before stating any claim — library API, infrastructure behavior, root cause — verify it against source 1 or 2 and cite the evidence.
Do not assert without evidence.

If verification is impossible, explicitly state "I could not verify this" rather than guessing.
Do not use hedged language when verification is possible — verify instead.

## Sandbox Awareness

If a command fails, consider sandbox restrictions before attributing it to environment or version issues.
TLS errors from trusted public APIs (GitHub, npm, etc.) are sandbox-caused, not genuine
certificate failures — immediately retry with `dangerouslyDisableSandbox: true`.

## Response Default

Questions are requests for information, not for changes — answer only, no file edits, no mutating commands.
Prefix `Q:` or `ask:` marks a message explicitly as a question when intent might be ambiguous.
