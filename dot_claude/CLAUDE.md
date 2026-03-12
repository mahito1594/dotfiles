# Guidelines

## Verification First

Prioritize information sources in this order:

1. In-context evidence — repository code, file reads, tool results
2. Retrieved documentation — context7 for library/framework/CLI docs, web fetch otherwise
3. Model training knowledge — treat as low-confidence for version- or config-specific details

For library, framework, or CLI specifics, level 3 alone is not sufficient. Use context7.

When a recommendation is questioned, explain reasoning with evidence before reconsidering.

## Sandbox Awareness

If a command fails, consider sandbox restrictions before attributing it to environment or version issues.
Disable sandbox only to confirm the cause.
