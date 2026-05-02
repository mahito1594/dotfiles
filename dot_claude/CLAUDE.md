# Guidelines

## Verification First

Prioritize information sources in this order:

1. In-context evidence — repository code, file reads, tool results
2. Retrieved documentation — context7 for library/framework/CLI docs, web fetch otherwise
3. Model training knowledge — always treat as hypothesis. Confidence does not substitute for verification. Verify third-party library APIs against the version pinned in the project's dependency file before use.

For library, framework, or CLI specifics, use context7 to obtain the answer, not to confirm what you already believe.

If verification is impossible, explicitly state "I could not verify this" rather than guessing.
Never use hedged speculation ("probably", "likely") as a substitute for verification.

## Sandbox Awareness

If a command fails, consider sandbox restrictions before attributing it to environment or version issues.
Disable sandbox only to confirm the cause.

## Response Default

Questions are requests for information, not for changes.
Do not modify files unless the message contains an explicit imperative.

Prefix `Q:` or `ask:` marks a question — answer only, no file edits, no mutating commands.
